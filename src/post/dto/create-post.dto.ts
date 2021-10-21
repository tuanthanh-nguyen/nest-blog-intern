import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsArray()
  tagList: string[]

  @IsString()
  @IsOptional()
  author: string;

  @IsString()
  @IsOptional()
  file: string;
}

export interface QueryOffset {
  take?: number;
  skip?: number;
}

export interface QueryProperty extends QueryOffset  {
  author?: string;
}