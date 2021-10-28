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
  JoinTable,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Comment } from '../entities/comment.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { classToPlain, Transform } from 'class-transformer';
import * as slugify from 'slug';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Post {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  @Transform(({ value }) => value.toString())
  id: number;

  @ApiProperty()
  @Column()
  slug: string;

  @ApiProperty()
  @Column({
    length: 255,
  })
  title: string;

  @ApiProperty()
  @Column({
    type: 'text',
  })
  content: string;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  file: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @ManyToOne((type) => User, (user) => user.posts)
  author: User;

  @ApiProperty()
  @OneToMany((type) => Comment, (comment) => comment.post)
  comments: Comment[];

  @ApiProperty()
  @ManyToMany((type) => Tag, (tag) => tag.posts)
  @JoinTable({
    name: "post_tags", // table name for the junction table of this relation
    joinColumn: {
        name: "post",
        referencedColumnName: "id"
    },
    inverseJoinColumn: {
        name: "tag",
        referencedColumnName: "id"
    }
  })
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
