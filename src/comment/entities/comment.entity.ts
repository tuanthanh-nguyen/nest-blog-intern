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

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
  })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => User, (user) => user.comments)
  author: User;

  @ManyToOne((type) => Post, (post) => post.comments)
  post: Post;

  constructor(partial: Partial<Comment> = {}) {
      Object.assign(this, partial);
  }

  toJSON() {
    return classToPlain(this);
  }
}
