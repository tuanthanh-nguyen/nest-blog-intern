import { Post } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { plainToClass, Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { LessThan, MoreThan, Raw } from 'typeorm';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  tags: TagDto[];
}

export class TagDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description: string;
}

export class CreatePostDtoSwaggerBody {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  tags: TagDto[];

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  file: any;
}

export class QueryCommon {
  @ApiProperty({ required: false, description: 'timestamp' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  fromDate: number;

  @ApiProperty({ required: false, description: 'timestamp' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  toDate: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortField: string;

  @ApiProperty({ required: false, description: '-1 => DESC, 1 => ASC' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortType: number;

  getQueryCommonObject(): QueryCommon {
    const options = {};
    // if (this.fromDate) options['createdAt'] = MoreThan(this.fromDate)
    // if (this.toDate) options['createdAt'] = LessThan(this.toDate)
    if (this.limit && this.offset) {
      options['take'] = this.limit;
      options['skip'] = this.offset;
    }
    options['order'] = { [this.sortField || 'id']: this.sortType || 'DESC' };
    return plainToClass(QueryCommon, options);
  }
}

export class QueryPostProperty extends QueryCommon {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tags?: string[];

  getQueryPostObject(): QueryPostProperty {
    const postQueryObject = {};
    if (this.fromDate) postQueryObject['createdAt'] = MoreThan(this.fromDate);
    if (this.toDate) postQueryObject['createdAt'] = LessThan(this.toDate);
    if (this.author) postQueryObject['author'] = this.author;
    if (this.title) postQueryObject['title'] = this.title;
    const queryOptions = Object.assign({}, this.getQueryCommonObject(), {
      where: postQueryObject,
    });
    return plainToClass(QueryPostProperty, queryOptions);
  }
}
