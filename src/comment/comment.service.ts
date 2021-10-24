import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostService } from 'src/post/post.service';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @Inject(forwardRef(() => PostService))
    private readonly postsService: PostService
  ) {}
  
  async create(createCommentDto: CreateCommentDto) {
    return await this.commentsRepository.save(createCommentDto);
  }
  
  async createPostComment(comment: Comment): Promise<Comment> {
    const createdComment = await this.commentsRepository.save(comment);
    return new Comment(createdComment.toJSON());
  }
  
  async getPostComment(slug: string): Promise<Comment[]> {
    const post = this.postsService.findPostBySlug(slug);
    const comments = await this.commentsRepository.find({
      where: {post: post},
      relations: ['author']
    })
    return comments.map(comment => new Comment(comment.toJSON()));
  }

  findAll() {
    return this.commentsRepository.find();
  }

  findOne(id: number) {
    return this.commentsRepository.findOne(id);
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const toUpdate = await this.commentsRepository.findOne(id);
    const updated = Object.assign(toUpdate, updateCommentDto);
    return await this.commentsRepository.save(updated);
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
