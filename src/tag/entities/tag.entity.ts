import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from 'src/post/entities/post.entity';
import { classToPlain } from 'class-transformer';
import { text } from 'stream/consumers';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
    unique: true,
  })
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany((type) => Post, (post) => post.tags)
  // @JoinTable()
  posts: Post[];

  constructor(partial: Partial<Tag> = {}) {
    Object.assign(this, partial);
  }

  toJSON() {
    return classToPlain(this);
  }
}
