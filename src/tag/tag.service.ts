import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
