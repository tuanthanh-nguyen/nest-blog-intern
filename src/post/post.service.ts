import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

class CreatePostEntity {
  title: string;
  content: string;
  file: string;
}

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createPostEntity: CreatePostEntity): Promise<Post> {
    return await this.postsRepository.save(createPostEntity);
  }

  findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  findOne(id: string): Promise<Post> {
    return this.postsRepository.findOne(id);
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
