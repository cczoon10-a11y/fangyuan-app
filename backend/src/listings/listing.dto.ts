import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  MinLength,
  MaxLength,
  Min,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ListingStatus } from './listing.entity';

export class CreateListingDto {
  @ApiProperty()
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title_en?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title_km?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  section_id: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  area_id: number;

  @ApiProperty()
  @IsString()
  bedroom: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  bathroom?: number;

  @ApiProperty()
  @IsNumber()
  @Min(10)
  area_sqm: number;

  @ApiProperty()
  @IsNumber()
  @Min(1000)
  price: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  floor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  orientation?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiProperty({ required: false, type: [Number] })
  @IsOptional()
  @IsArray()
  indoor_amenities?: number[];

  @ApiProperty({ required: false, type: [Number] })
  @IsOptional()
  @IsArray()
  nearby_amenities?: number[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  tags?: string[];
}

export class UpdateListingDto extends CreateListingDto {}

export class ListingQueryDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  section?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  area?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  price_min?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  price_max?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  bedroom?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  area_min?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  area_max?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  keyword?: string;

  @ApiProperty({ required: false, enum: ['latest', 'price_asc', 'price_desc', 'area_asc', 'area_desc'] })
  @IsOptional()
  sort?: string;

  @ApiProperty({ required: false, enum: ListingStatus })
  @IsOptional()
  @IsEnum(ListingStatus)
  status?: ListingStatus;
}

export class RejectListingDto {
  @ApiProperty()
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  reason: string;
}
