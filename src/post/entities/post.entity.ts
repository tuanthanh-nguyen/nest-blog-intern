import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  BeforeInsert,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { classToPlain, Transform } from 'class-transformer';
import * as slugify from 'slug';


@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  @Transform(({value}) => value.toString())
  id: number;

  @Column()
  slug: string;

  @Column({
    length: 255,
  })
  title: string;

  @Column({
    type: 'text',
  })
  content: string;

  @Column({
    nullable: true
  })
  file: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => User, (user) => user.posts)
  author: User;

  @OneToMany((type) => Comment, (comment) => comment.post)
  comments: Comment[];

  @ManyToMany((type) => Tag, (tag) => tag.posts)
  tags: Tag[];

  constructor(partial: Partial<Post> = {}) {
    Object.assign(this, partial);
  }

  @BeforeInsert()
  generateSlug() {
    this.slug =
      slugify(this.title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }

  toJSON() {
    return classToPlain(this);
  }
}

