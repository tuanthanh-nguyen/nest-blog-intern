import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    unique: true
  })
  username: string;

  @Column({
    length: 20,
  })
  password: string;

  @Column({
    length: 40,
    unique: true
  })
  email: string;

  @Column({
    default: false
  })
  isEmailVerified: boolean

  @OneToMany((type) => Post, (post) => post.author)
  posts: Post[];

  @OneToMany((type) => Comment, (comment) => comment.author)
  comments: Comment[];
}
