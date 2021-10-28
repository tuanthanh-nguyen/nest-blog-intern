import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateTagDto } from './dto/update-tag.dto';

@ApiTags('tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: 'get all posts from a tag' })
  @ApiOkResponse({ description: 'posts returned successfully' })
  @Get(':name')
  getPostsByTagName(@Param('name') tag: string) {
    return this.tagService.getPostsByTagName(tag);
  }

  @ApiOperation({ summary: 'get all tags from database' })
  @ApiOkResponse({ description: 'tags returned successfully' })
  @Get()
  getListOfTags() {
    return this.tagService.getListOfTags();
  }

  @ApiOperation({ summary: 'create tag' })
  @ApiCreatedResponse({ description: 'tag created succesfullt' })
  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Patch(':name')
  updateTagByName(@Param('name') name: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.updateTagByName(name, updateTagDto);
  }
}