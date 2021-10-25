import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagDto } from 'src/post/dto/create-post.dto';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const tag = await this.tagsRepository.save(createTagDto);
    return new Tag(tag.toJSON());
  }

  async findOrCreate(tags: TagDto[]): Promise<Tag[]> {
    const tagList = [];
    for (const tag of tags) {
      const existingTag = await this.findOneByTagName(tag.name);
      if (existingTag) {
        tagList.push(existingTag);
        continue;
      }
      const newTag = new Tag(tag);
      const createdTag = await this.tagsRepository.save(newTag);
      tagList.push(new Tag(createdTag.toJSON()));
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
    if (!tag) return;
    return new Tag(tag.toJSON());
  }

  // findOne(id: number) {
  //   return this.tagsRepository.findOne(id);
  // }

  // async update(id: number, updateTagDto: UpdateTagDto) {
  //   const toUpdate = await this.tagsRepository.findOne(id);
  //   const updated = Object.assign(toUpdate, updateTagDto);
  //   return await this.tagsRepository.save(updated);
  // }

  // async remove(id: number) {
  //   await this.tagsRepository.delete(id);
  // }
}
