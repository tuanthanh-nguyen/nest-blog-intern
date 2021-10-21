import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentService } from 'src/comment/comment.service';
import { User } from 'src/user/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { CreatePostDto, QueryProperty } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private commentsService: CommentService,
    private usersService: UserService
    ) {}
    
  async create(createPostDto: CreatePostDto): Promise<Post> {
    const user = await this.usersService.findOne(createPostDto.author);
    const createPostData = Object.assign({}, createPostDto, {author: user});
    const postToCreate = new Post(createPostData);
    const createdPost =  await this.postsRepository.save(postToCreate);
    return new Post(createdPost.toJSON());
  }
  
  async createPostComment(createCommentDto: any, user: User, slug: string): Promise<Comment> {
    const post = await this.postsRepository.findOne({slug: slug});
    const createCommentData = Object.assign({}, createCommentDto, {author: user, post: post});
    const CommentToCreate = new Comment(createCommentData);
    const createdComment = await this.commentsService.createPostComment(CommentToCreate);
    return new Comment(createdComment.toJSON());
  }

  async getPostCommentBySlug(slug: string): Promise<Post> {
    const post = await this.postsRepository.findOne( {
        where : {slug: slug},
        relations: ['comments']
      }
    )
    return new Post(post.toJSON());
  }

  async getPostByQuery(query: QueryProperty): Promise<Post[]> {
    const findOptions = { 
      ...query,
    }
    const posts = await this.postsRepository.find(findOptions);
    return posts.map(post => new Post(post.toJSON()));
  }

  async findAll(): Promise<Post[]> {
    const posts = await this.postsRepository.find({relations: ['author']});
    return posts.map(post => new Post(post.toJSON()));
  }
  
  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne(id); 
    return new Post(post.toJSON());
  }
    
  findByTitle(title: string) {
    return this.postsRepository.find({
      title: Like(`${title}`),
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const toUpdate = await this.postsRepository.findOne(id);
    const updated = Object.assign(toUpdate, updatePostDto);
    return await this.postsRepository.save(updated);
  }
  async remove(id: string): Promise<void> {
    await this.postsRepository.delete(id);
  }
}
