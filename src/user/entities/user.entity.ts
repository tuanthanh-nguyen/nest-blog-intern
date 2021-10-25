import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { classToPlain, Exclude, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  @Transform(({ value }) => value.toString())
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @Column({
    length: 20,
    unique: true,
  })
  username: string;

  @Column({
    length: 20,
  })
  @Exclude()
  password: string;

  @ApiProperty()
  @Column({
    length: 40,
    unique: true,
  })
  email: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @OneToMany((type) => Post, (post) => post.author)
  posts: Post[];

  @ApiProperty()
  @OneToMany((type) => Comment, (comment) => comment.author)
  comments: Comment[];

  constructor(partial: Partial<User> = {}) {
    Object.assign(this, partial);
  }

  toJSON() {
    return classToPlain(this);
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }
}
