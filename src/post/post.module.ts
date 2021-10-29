import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { TagModule } from 'src/tag/tag.module';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Comment]), UserModule, TagModule],
  controllers: [PostController],
  providers: [PostService, CommentService],
  exports: [PostService],
})
export class PostModule {}
