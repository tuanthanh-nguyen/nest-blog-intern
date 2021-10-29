import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentService } from 'src/post/comment.service';
import { User } from 'src/user/entities/user.entity';
import { Like, MoreThan, Repository } from 'typeorm';
import {
  CreatePostDto,
  QueryPostProperty,
  TagDto,
} from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { TagService } from 'src/tag/tag.service';
import { Tag } from 'src/tag/entities/tag.entity';
import { CreateCommentDto } from 'src/post/dto/create-comment.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @Inject(forwardRef(() => CommentService))
    private commentsService: CommentService,
    private tagsService: TagService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    user: User,
    file?: Express.Multer.File,
  ): Promise<Post> {
    const createPostData = Object.assign({}, createPostDto, {
      author: user,
    });
    if (createPostDto.tags) {
      const tags = await this.tagsService.findOrCreate(createPostDto.tags);
      createPostData['tags'] = tags;
    } else
      createPostData['tags'] = await this.tagsService.findOrCreate([
        {
          name: 'default-tag',
          description: 'defaulted',
        },
      ]);
    if (file) createPostData['file'] = file.filename;
    // @ts-ignore
    const postToCreate = new Post(createPostData);
    const createdPost = await this.postsRepository.save(postToCreate);
    return new Post(createdPost.toJSON());
  }

  /**
   * @description: this function returns a newly created comment
   * @param createCommentDto
   * @param user
   * @param slug
   * @returns Promise
   */
  async createPostComment(
    createCommentDto: CreateCommentDto,
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

  /**
   * @description: this function returns list of comments in this post
   * @description: each comment will have associated author
   * @param slug
   * @returns Promise
   */
  async getPostCommentBySlug(slug: string): Promise<Post> {
    const post = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.comments', 'comment')
      .leftJoinAndSelect('comment.author', 'author')
      .where('post.slug = :slug', { slug: slug })
      .getOne();
    return new Post(post.toJSON());
  }

  /**
   * @description: this function returns list of posts filter with query options
   * @param query
   * @returns Promise
   */
  async getPostByQuery(query: QueryPostProperty): Promise<Post[]> {
    const findOptions = {
      ...plainToClass(QueryPostProperty, query).getQueryPostObject(),
      relations: ['tags', 'author', 'comments'],
    };
    const commentsCount = await this.postsRepository
      .createQueryBuilder('post')
      .select('post.id', 'id')
      .leftJoin('post.comments', 'post_comment')
      .addSelect('Count(post_comment.id)', 'count')
      .groupBy('id')
      .getRawMany();
    console.log(commentsCount);
    const posts = await this.postsRepository.find(findOptions);
    return posts.map((post) => new Post(post.toJSON()));
  }

  async getPostByTagName(): Promise<Post[]> {
    const posts = await this.postsRepository.find({
      relations: ['tags', 'author', 'comments'],
    });
    return posts.map((post) => new Post(post.toJSON()));
  }

  async findPostBySlug(slug: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { slug: slug },
    });
    return new Post(post.toJSON());
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
    file?: Express.Multer.File,
  ): Promise<Post> {
    const toUpdate = await this.postsRepository.findOne(id);
    // if (toUpdate.author.id !== user.id) {
    //   throw new UnauthorizedException();
    // }
    if (file) {
      toUpdate.file = file.filename;
    }
    const updated = Object.assign(toUpdate, updatePostDto);
    return await this.postsRepository.save(updated);
  }

  async removeTag(id: number, tagToRemove: TagDto): Promise<void> {
    const post = await this.postsRepository.findOne(id, {
      relations: ['tags'],
    });
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
    const post = await this.postsRepository.findOne(id, {
      relations: ['tags'],
    });
    post.tags = post.tags.filter((tag) => {
      return tag.name !== tagToUpdate.name;
    });
    const newTag = await this.tagsService.findOrCreate([updateTo]);
    post.tags.push(...newTag);
    const updatedPost = await this.postsRepository.save(post);
    return new Post(updatedPost.toJSON());
  }

  async remove(id: string): Promise<void> {
    await this.postsRepository.delete(id);
  }
}
