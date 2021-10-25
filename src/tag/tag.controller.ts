import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

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

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.tagService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
  //   return this.tagService.update(+id, updateTagDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tagService.remove(+id);
  // }
}
