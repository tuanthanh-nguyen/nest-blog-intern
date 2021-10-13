import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Post } from 'src/post/entities/post.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
    unique: true,
  })
  name: string;

  @ManyToMany((type) => Post, (post) => post.tags)
  @JoinTable()
  posts: Post[];
}
