import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { Post } from '../post/entities/post.entity';
import { TagModule } from './tag.module';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async create(createTagDto: CreateTagDto, post_id: string): Promise<Tag> {
    let tag = await this.tagsRepository.findOne({
      where: { name: createTagDto.name },
      relations: ['posts'],
    });
    const post = await this.postsRepository.findOne(post_id);
    if (!tag) {
      tag = Object.assign(new Tag(), createTagDto);
      tag.posts = [post];
      return await this.tagsRepository.save(tag);
    }
    tag.posts.push(post);
    return await this.tagsRepository.save(tag);
  }

  async listPost(id: string): Promise<Tag> {
    return await this.tagsRepository.findOne(id, {
      relations: ['posts'],
    });
  }

  findAll() {
    return `This action returns all tag`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  async remove(id: number) {
    await this.tagsRepository.delete(id);
  }
}
