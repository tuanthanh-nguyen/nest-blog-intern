import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagDto } from 'src/post/dto/create-post.dto';
import { Post } from 'src/post/entities/post.entity';
import { PostService } from 'src/post/post.service';
import { createQueryBuilder, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import {getConnection} from "typeorm";

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagsRepository.save(createTagDto);
  }

  async findOrCreate(tags: TagDto[]): Promise<Tag[]> {
    console.log('tagsDTO')
    console.log(tags)
    tags.forEach(async tag => {
      const existingTag = await this.findOneByTagName(tag.name);
      if (existingTag)  {
        console.log('existedTag')
        console.log(existingTag)
        return;
      }
      const newTag = new Tag({
        name: tag.name,
        description: tag.description,
      })
      console.log('newTag')
      console.log(newTag)
      const createdTag = await this.tagsRepository.save(newTag);
      console.log('createdTag')
      console.log(createdTag.toJSON())
    })
    const getTags = await getConnection().createQueryBuilder(Tag, "tag")
    .where("tag.name IN (:...names)", { names: tags.map(tag => tag.name) }).getMany()
    // const getTags = await this.tagsRepository.find({
    //   where: {name: tags.map(tag => tag.name)}
    // })
    console.log('getTags')
    console.log(getTags)
    return getTags.map(tag => new Tag(tag.toJSON()));
  }

  async getPostByTagName(name: string): Promise<Tag> {
    const tag = await this.tagsRepository.findOne({
      where: {name: name},
      relations: ['posts']
    })
    return new Tag(tag.toJSON());
  }

  async findOneByTagName(name: string): Promise<Tag> {
    const tag = await this.tagsRepository.findOne({
      where: {name: name},
    });
    if (!tag)
      return 
    return new Tag(tag.toJSON());
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
