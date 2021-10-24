import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { cp } from 'fs';

// const transformTags = tags => {
//   if (Array.isArray(tags)) {
//     const tagList = [];
//     tags.forEach(tag => tagList.push(tag.name))
//     return tagList;
//   } else {
//     return tags;
//   }
// }

const transformTags = ({ value }) => {
  if (Array.isArray(value)) {
    return value.map((tag) => {});
  } else {
    console.log('1');
    return value;
  }
};

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({required: false})
  @IsOptional()
  // @Transform(transformTags)
  tags: TagDto[];
}

export class TagDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;
}

export class QueryOffset {
  @ApiProperty({required: false})
  @IsOptional()
  @IsNumber()
  take?: number;

  @ApiProperty({required: false})
  @IsOptional()
  @IsNumber()
  skip?: number;
}

export class QueryProperty extends QueryOffset {
  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  author?: string;
}
