import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
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
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  // @Transform(transformTags)
  tags: TagDto[];
}

export class TagDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}

export interface QueryOffset {
  take?: number;
  skip?: number;
}

export interface QueryProperty extends QueryOffset {
  author?: string;
}
