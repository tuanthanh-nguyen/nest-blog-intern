import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentService } from 'src/comment/comment.service';
import { User } from 'src/user/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { CreatePostDto, QueryProperty, TagDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { TagService } from 'src/tag/tag.service';
import { Tag } from 'src/tag/entities/tag.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private commentsService: CommentService,
    private tagsService: TagService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    user: User,
    filePath?: string,
  ): Promise<Post> {
    const tags = await this.tagsService.findOrCreate(createPostDto.tags);
    const createPostData = Object.assign({}, createPostDto, {
      author: user,
      tags: tags,
    });
    if (filePath) createPostData['file'] = filePath;
    const postToCreate = new Post(createPostData);
    const createdPost = await this.postsRepository.save(postToCreate);
    return new Post(createdPost.toJSON());
  }

  async createPostComment(
    createCommentDto: any,
    user: User,
    slug: string,
  ): Promise<Comment> {
    const post = await this.postsRepository.findOne({ slug: slug });
    const createCommentData = Object.assign({}, createCommentDto, {
      author: user,
      post: post,
    });
    const CommentToCreate = new Comment(createCommentData);
    const createdComment = await this.commentsService.createPostComment(
      CommentToCreate,
    );
    return new Comment(createdComment.toJSON());
  }

  async getPostCommentBySlug(slug: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { slug: slug },
      relations: ['tags', 'author', 'comments'],
    });
    return new Post(post.toJSON());
  }

  async getPostByQuery(query: QueryProperty): Promise<Post[]> {
    const findOptions = {
      ...query,
      relations: ['tags', 'author', 'comments'],
    };
    const posts = await this.postsRepository.find(findOptions);
    return posts.map((post) => new Post(post.toJSON()));
  }

  async getPostByTagName(): Promise<Post[]> {
    const posts = await this.postsRepository.find({
      relations: ['tags', 'author', 'comments'],
    });
    return posts.map((post) => new Post(post.toJSON()));
  }

  async findAll(): Promise<Post[]> {
    const posts = await this.postsRepository.find({
      relations: ['author', 'tags'],
    });
    return posts.map((post) => new Post(post.toJSON()));
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne(id, {
      relations: ['author', 'tags', 'comments'],
    });
    return new Post(post.toJSON());
  }

  findByTitle(title: string) {
    return this.postsRepository.find({
      title: Like(`${title}`),
    });
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    user: User,
    file?: string,
  ): Promise<Post> {
    const toUpdate = await this.postsRepository.findOne(id);
    // if (toUpdate.author.id !== user.id) {
    //   throw new UnauthorizedException();
    // }
    if (file) {
      toUpdate.file = file;
    }
    const updated = Object.assign(toUpdate, updatePostDto);
    return await this.postsRepository.save(updated);
  }

  async removeTag(id: number, tagToRemove: TagDto): Promise<void> {
    const post = await this.postsRepository.findOne(id);
    post.tags = post.tags.filter((tag) => {
      return tag.name !== tagToRemove.name;
    });
    await this.postsRepository.save(post);
  }

  async updateTag(
    id: number,
    tagToUpdate: TagDto,
    updateTo: TagDto,
  ): Promise<Post> {
    const post = await this.postsRepository.findOne(id);
    post.tags = post.tags.filter((tag) => {
      return tag.name !== tagToUpdate.name;
    });
    const newTag = new Tag(updateTo);
    post.tags.push(newTag);
    const updatedPost = await this.postsRepository.save(post);
    return new Post(updatedPost.toJSON());
  }

  async remove(id: string): Promise<void> {
    await this.postsRepository.delete(id);
  }
}
