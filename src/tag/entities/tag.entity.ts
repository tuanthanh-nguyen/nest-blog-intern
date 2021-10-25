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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Tag {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({
    length: 255,
    unique: true,
  })
  name: string;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  description: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
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
