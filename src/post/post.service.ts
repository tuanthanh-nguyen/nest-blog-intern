import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createPostDto: CreatePostDto, author_id: string): Promise<Post> {
    const post = Object.assign(new Post(), createPostDto);
    const author = await this.usersRepository.findOne(author_id);
    post.author = author;
    return await this.postsRepository.save(post);
  }

  async findUserPost(author_id: string): Promise<Post[]> {
    return await this.postsRepository.find({
      where: { author: author_id },
      relations: ['author'],
    });
  }

  findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  findOne(id: string): Promise<Post> {
    return this.postsRepository.findOne(id);
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const toUpdate = await this.postsRepository.findOne(id);
    const updated = Object.assign(toUpdate, updatePostDto);
    return await this.postsRepository.save(updated);
  }
  async remove(id: string): Promise<void> {
    await this.postsRepository.delete(id);
  }
}
