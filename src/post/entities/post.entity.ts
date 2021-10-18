import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Tag } from 'src/tag/entities/tag.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
  })
  title: string;

  @Column({
    type: 'text',
  })
  content: string;

  @Column()
  file: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: string;

  @ManyToOne((type) => User, (user) => user.posts)
  author: User;

  @OneToMany((type) => Comment, (comment) => comment.post)
  comments: Comment[];

  @ManyToMany((type) => Tag, (tag) => tag.posts)
  tags: Tag[];
}
