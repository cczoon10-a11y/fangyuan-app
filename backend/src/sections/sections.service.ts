import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Section } from './section.entity';

@Injectable()
export class SectionsService {
  constructor(@InjectRepository(Section) private repo: Repository<Section>) {}

  async findAllPublic() {
    return this.repo.find({
      where: { isEnabled: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async findAll() {
    return this.repo.find({ order: { sortOrder: 'ASC' } });
  }

  async findOne(id: number) {
    const s = await this.repo.findOne({ where: { id } });
    if (!s) throw new NotFoundException('板块不存在');
    return s;
  }

  async create(data: Partial<Section>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<Section>) {
    await this.findOne(id);
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException();
    return { success: true };
  }
}
