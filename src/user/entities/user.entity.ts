import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
  })
  username: string;

  @Column({
    length: 20,
  })
  password: string;

  @Column({
    length: 40,
  })
  email: string;

  @OneToMany((type) => Post, (post) => post.author)
  posts: Post[];

  @OneToMany((type) => Comment, (comment) => comment.author)
  comments: Comment[];
}
