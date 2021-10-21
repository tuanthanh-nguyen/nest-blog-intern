import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagDto } from 'src/post/dto/create-post.dto';
import { Post } from 'src/post/entities/post.entity';
import { PostService } from 'src/post/post.service';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagsRepository.save(createTagDto);
  }

  async getPostByTagName(name: string): Promise<Post[]> {
    const posts = await this.tagsRepository.find({
      where: {name: name},
      relations: ['posts']
    })
    return posts.map(post => new Post(post.toJSON())); 
  }

  async findOrCreate(tags: TagDto[]): Promise<Tag[]> {
    tags.forEach(tag => {
      const newTag = new Tag({
        name: tag.name,
        description: tag.description
      })
      this.tagsRepository.save(newTag);
    })
    const getTags = await this.tagsRepository.find({
      where: {name: tags}
    })
    return getTags.map(tag => new Tag(tag.toJSON()));
  }

  findAll() {
    return this.tagsRepository.find();
  }

  findOne(id: number) {
    return this.tagsRepository.findOne(id);
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const toUpdate = await this.tagsRepository.findOne(id);
    const updated = Object.assign(toUpdate, updateTagDto);
    return await this.tagsRepository.save(updated);
  }

  async remove(id: number) {
    await this.tagsRepository.delete(id);
  }
}
