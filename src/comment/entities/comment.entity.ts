import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { classToPlain } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Comment {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({
    type: 'text',
  })
  content: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @ManyToOne((type) => User, (user) => user.comments)
  author: User;

  @ApiProperty()
  @ManyToOne((type) => Post, (post) => post.comments)
  post: Post;

  constructor(partial: Partial<Comment> = {}) {
    Object.assign(this, partial);
  }

  toJSON() {
    return classToPlain(this);
  }
}
