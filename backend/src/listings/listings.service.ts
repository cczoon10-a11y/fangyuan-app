import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, IsNull } from 'typeorm';
import { Listing, ListingStatus, PublisherType } from './listing.entity';
import { CreateListingDto, UpdateListingDto, ListingQueryDto } from './listing.dto';
import { paginate } from '../common/pagination.util';
import { AuthUser, TokenType } from '../auth/auth.types';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing) private repo: Repository<Listing>,
    private dataSource: DataSource,
  ) {}

  /**
   * 公共查询(用户端/未登录可访问,只看 online)
   */
  async publicList(query: ListingQueryDto) {
    const qb = this.repo.createQueryBuilder('l')
      .where('l.deleted_at IS NULL')
      .andWhere('l.status = :status', { status: ListingStatus.ONLINE });

    if (query.section) qb.andWhere('l.section_id = :s', { s: query.section });
    if (query.area) {
      const areas = query.area.split(',').map(Number).filter(Boolean);
      if (areas.length) qb.andWhere('l.area_id IN (:...a)', { a: areas });
    }
    if (query.price_min) qb.andWhere('l.price_usd >= :pm', { pm: query.price_min });
    if (query.price_max) qb.andWhere('l.price_usd <= :pmx', { pmx: query.price_max });
    if (query.bedroom) qb.andWhere('l.bedroom = :br', { br: query.bedroom });
    if (query.area_min) qb.andWhere('l.area_sqm >= :am', { am: query.area_min });
    if (query.area_max) qb.andWhere('l.area_sqm <= :amx', { amx: query.area_max });
    if (query.keyword) {
      qb.andWhere('(l.title ILIKE :k OR l.title_en ILIKE :k)', { k: `%${query.keyword}%` });
    }

    // 排序
    const sortMap: Record<string, [string, 'ASC' | 'DESC']> = {
      latest: ['l.published_at', 'DESC'],
      price_asc: ['l.price_usd', 'ASC'],
      price_desc: ['l.price_usd', 'DESC'],
      area_asc: ['l.area_sqm', 'ASC'],
      area_desc: ['l.area_sqm', 'DESC'],
    };
    const [field, dir] = sortMap[query.sort || 'latest'] || sortMap.latest;
    qb.orderBy(field, dir);

    return paginate<Listing>(qb, query);
  }

  /**
   * 获取单条详情(公共)
   */
  async findOne(id: number) {
    const listing = await this.repo.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!listing) throw new NotFoundException('房源不存在');

    // 只有 online 的才对外展示(管理员接口另外处理)
    if (listing.status !== ListingStatus.ONLINE) {
      throw new NotFoundException('房源不存在');
    }

    // 计数 +1(注意异步,不影响返回)
    this.repo.increment({ id }, 'viewCount', 1).catch(() => void 0);

    return listing;
  }

  /**
   * 管理员发布(直接上架)
   */
  async adminCreate(user: AuthUser, dto: CreateListingDto) {
    const listing = this.buildFromDto(dto);
    listing.publisherType = PublisherType.ADMIN;
    listing.publisherId = user.id;
    listing.status = ListingStatus.ONLINE;
    listing.reviewedAt = new Date();
    listing.reviewedBy = user.id;
    listing.publishedAt = new Date();

    return this.repo.save(listing);
  }

  /**
   * 经纪人发布(需审核)
   */
  async agentCreate(user: AuthUser, dto: CreateListingDto) {
    const listing = this.buildFromDto(dto);
    listing.publisherType = PublisherType.AGENT;
    listing.publisherId = user.id;
    listing.status = ListingStatus.PENDING_REVIEW;
    return this.repo.save(listing);
  }

  private buildFromDto(dto: CreateListingDto): Listing {
    const listing = new Listing();
    Object.assign(listing, {
      title: dto.title,
      titleEn: dto.title_en,
      titleKm: dto.title_km,
      description: dto.description,
      sectionId: dto.section_id,
      areaId: dto.area_id,
      bedroom: dto.bedroom,
      bathroom: dto.bathroom,
      areaSqm: dto.area_sqm,
      price: dto.price,
      priceUsd: dto.price,  // 主币 USD
      pricePerSqm: dto.area_sqm ? Number((dto.price / dto.area_sqm).toFixed(2)) : null,
      floor: dto.floor,
      orientation: dto.orientation,
      address: dto.address,
      latitude: dto.latitude,
      longitude: dto.longitude,
      coverImage: dto.images?.[0] || null,
      imagesCount: dto.images?.length || 0,
      indoorAmenities: dto.indoor_amenities || [],
      nearbyAmenities: dto.nearby_amenities || [],
      tags: dto.tags || [],
    });
    return listing;
  }

  /**
   * 用户修改(仅自己)
   */
  async ownerUpdate(user: AuthUser, id: number, dto: UpdateListingDto) {
    const listing = await this.repo.findOne({ where: { id, deletedAt: IsNull() } });
    if (!listing) throw new NotFoundException();

    // 权限:仅创建者本人
    if (
      listing.publisherType !== (user.type === TokenType.ADMIN ? 'admin' : 'agent') ||
      listing.publisherId !== user.id
    ) {
      throw new ForbiddenException('只能修改自己发布的房源');
    }

    // 经纪人编辑已上架的房源:修改核心字段需要重新审核
    if (user.type === TokenType.AGENT && listing.status === ListingStatus.ONLINE) {
      const coreFields = ['price', 'area_sqm', 'bedroom', 'section_id', 'area_id'];
      const changed = coreFields.some((f) => dto[f] !== undefined && dto[f] !== listing[f]);
      if (changed) {
        listing.status = ListingStatus.PENDING_REVIEW;
      }
    }

    // 只合并 dto 里有的字段,避免用 new Listing() 覆盖已有值
    const updatable: Partial<Listing> = {
      title: dto.title,
      titleEn: dto.title_en,
      titleKm: dto.title_km,
      description: dto.description,
      sectionId: dto.section_id,
      areaId: dto.area_id,
      bedroom: dto.bedroom,
      bathroom: dto.bathroom,
      areaSqm: dto.area_sqm,
      price: dto.price,
      priceUsd: dto.price,
      pricePerSqm: dto.area_sqm ? Number((dto.price / dto.area_sqm).toFixed(2)) : listing.pricePerSqm,
      floor: dto.floor,
      orientation: dto.orientation,
      address: dto.address,
      latitude: dto.latitude,
      longitude: dto.longitude,
      coverImage: dto.images?.[0] ?? listing.coverImage,
      imagesCount: dto.images?.length ?? listing.imagesCount,
      indoorAmenities: dto.indoor_amenities ?? listing.indoorAmenities,
      nearbyAmenities: dto.nearby_amenities ?? listing.nearbyAmenities,
      tags: dto.tags ?? listing.tags,
    };
    // 过滤掉 undefined
    Object.keys(updatable).forEach((k) => updatable[k] === undefined && delete updatable[k]);
    Object.assign(listing, updatable);
    return this.repo.save(listing);
  }

  /**
   * 管理员删除(强权)
   */
  async adminDelete(id: number) {
    const res = await this.repo.softDelete(id);
    if (!res.affected) throw new NotFoundException();
    return { success: true };
  }

  /**
   * 审核通过
   */
  async approve(user: AuthUser, id: number) {
    const listing = await this.repo.findOne({ where: { id } });
    if (!listing) throw new NotFoundException();
    if (listing.status !== ListingStatus.PENDING_REVIEW) {
      throw new BadRequestException('该房源不在待审核状态');
    }

    await this.dataSource.transaction(async (mgr) => {
      await mgr.update(Listing, id, {
        status: ListingStatus.ONLINE,
        reviewedAt: new Date(),
        reviewedBy: user.id,
        publishedAt: listing.publishedAt || new Date(),
      });

      // 若发布者是经纪人,自动 +2 积分
      if (listing.publisherType === PublisherType.AGENT) {
        await mgr.query(
          `INSERT INTO points_balance(agent_id, balance, lifetime_earned)
           VALUES($1, 2, 2)
           ON CONFLICT (agent_id) DO UPDATE
             SET balance = points_balance.balance + 2,
                 lifetime_earned = points_balance.lifetime_earned + 2,
                 updated_at = NOW()`,
          [listing.publisherId],
        );
        const balanceRow = await mgr.query(
          `SELECT balance FROM points_balance WHERE agent_id = $1`,
          [listing.publisherId],
        );
        await mgr.query(
          `INSERT INTO points_history(agent_id, delta, balance_after, type, related_id, description)
           VALUES($1, 2, $2, 'listing_approved', $3, '房源审核通过')`,
          [listing.publisherId, balanceRow[0].balance, id],
        );

        // 写通知
        await mgr.query(
          `INSERT INTO notifications(recipient_type, recipient_id, type, title, body, data)
           VALUES('agent', $1, 'listing_approved', $2, $3, $4)`,
          [
            listing.publisherId,
            '您的房源已通过审核',
            `《${listing.title}》已上架,获得 +2 积分`,
            JSON.stringify({ listing_id: id, points: 2 }),
          ],
        );
      }
    });

    return { success: true };
  }

  /**
   * 审核驳回
   */
  async reject(user: AuthUser, id: number, reason: string) {
    const listing = await this.repo.findOne({ where: { id } });
    if (!listing) throw new NotFoundException();

    await this.repo.update(id, {
      status: ListingStatus.REJECTED,
      rejectionReason: reason,
      reviewedAt: new Date(),
      reviewedBy: user.id,
    });

    // 写通知
    if (listing.publisherType === PublisherType.AGENT) {
      await this.dataSource.query(
        `INSERT INTO notifications(recipient_type, recipient_id, type, title, body, data)
         VALUES('agent', $1, 'listing_rejected', $2, $3, $4)`,
        [
          listing.publisherId,
          '您的房源审核未通过',
          `《${listing.title}》: ${reason}`,
          JSON.stringify({ listing_id: id, reason }),
        ],
      );
    }

    return { success: true };
  }

  /**
   * 管理员查询(可看所有状态)
   */
  async adminList(query: ListingQueryDto) {
    const qb = this.repo.createQueryBuilder('l').where('l.deleted_at IS NULL');
    if (query.status) qb.andWhere('l.status = :s', { s: query.status });
    if (query.keyword) {
      qb.andWhere('(l.title ILIKE :k OR l.title_en ILIKE :k)', { k: `%${query.keyword}%` });
    }
    qb.orderBy('l.created_at', 'DESC');
    return paginate<Listing>(qb, query);
  }

  /**
   * 经纪人查询(仅自己)
   */
  async agentList(user: AuthUser, query: ListingQueryDto) {
    const qb = this.repo
      .createQueryBuilder('l')
      .where('l.deleted_at IS NULL')
      .andWhere('l.publisher_type = :pt', { pt: 'agent' })
      .andWhere('l.publisher_id = :pid', { pid: user.id });

    if (query.status) qb.andWhere('l.status = :s', { s: query.status });
    qb.orderBy('l.created_at', 'DESC');
    return paginate<Listing>(qb, query);
  }
}
