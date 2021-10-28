import { assignMetadata, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { assert } from 'console';
import { NotFoundError } from 'rxjs';
import { TagDto } from 'src/post/dto/create-post.dto';
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
      const newTag = new Tag(createTagDto);
      const tag = await this.tagsRepository.save(newTag);
      if (!tag) throw new BadRequestException();
    return tag;
  }

  async findOrCreate(tags: TagDto[]): Promise<Tag[]> {
    const tagList = [];
    for (const tag of tags) {
      const existingTag = await this.findOneByTagName(tag.name);
      if (existingTag) {
        tagList.push(existingTag);
        continue;
      }
      const newTag = await this.create(tag);
      tagList.push(newTag);
    }
    return tagList;
  }
  
  /**
   * @description: this function returns all post owned this tag
   * @description: each post will have author, number of comments attached
   * @param name string
   * @returns Promise<Tag>
   */
  async getPostsByTagName(name: string): Promise<Tag> {
    const tag = await this.tagsRepository
    .createQueryBuilder('tag')
    .leftJoinAndSelect('tag.posts', 'post')
    .leftJoinAndSelect('post.author', 'author')
    .leftJoinAndSelect('post.comments', 'comment')
    .leftJoinAndSelect('comment.author', 'comment_owner')
    .where('tag.name = :name', { name: name })
    .getOne();
    if (!tag) throw new NotFoundException();
    return new Tag(tag.toJSON());
  }
  
  /**
   * @description: this function returns list of tags with metadata
   * @returns Promise<Tag[]>
   */
  async getListOfTags(): Promise<Tag[] | null> {
    const tags = await this.tagsRepository.find();
    if (tags) {
      return tags.map((tag) => new Tag(tag.toJSON()));
    }
    return null;
  }
  
  async findOneByTagName(name: string): Promise<Tag> {
    const tag = await this.tagsRepository.findOne({
      where: { name: name },
    });
    if (!tag) return null;
    return new Tag(tag.toJSON());
  }

  async updateTagByName(name: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    let tagToUpdate = await this.findOneByTagName(name);
    Object.assign(tagToUpdate, updateTagDto);
    await this.tagsRepository.save(tagToUpdate);
    return tagToUpdate;
  }
}
