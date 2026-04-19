import { PaginationDto } from '../common/dto/pagination.dto';

/**
 * 通用分页查询辅助
 */
export async function paginate<T>(
  queryBuilder: any,
  dto: PaginationDto,
): Promise<{ list: T[]; total: number; page: number; page_size: number; total_pages: number }> {
  const page = Number(dto.page || 1);
  const pageSize = Number(dto.page_size || 20);

  queryBuilder.skip((page - 1) * pageSize).take(pageSize);

  const [list, total] = await queryBuilder.getManyAndCount();
  return {
    list,
    total,
    page,
    page_size: pageSize,
    total_pages: Math.ceil(total / pageSize),
  };
}
