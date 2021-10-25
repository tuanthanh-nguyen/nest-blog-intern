import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

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

  getQueryCommonObject() {
    const options = {};
    if (this.limit) options['take'] = this.limit;
    if (this.offset) options['skip'] = this.offset;
    if (this.sortType) {
      let type: any;
      if (this.sortType === 1) type = 'ASC';
      else type = 'DESC';
      const sortObject = {
        [this.sortField || 'id']: type,
      };
      options['order'] = sortObject;
    }
    return options;
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

  getQueryPostObject() {
    const commonQueryObject = this.getQueryCommonObject();
    const postQueryObject = {};
    if (this.author) postQueryObject['author'] = this.author;
    if (this.title) postQueryObject['title'] = this.title;
    return Object.assign({}, commonQueryObject, { where: postQueryObject });
  }
}
