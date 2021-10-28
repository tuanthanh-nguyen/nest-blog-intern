import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import {
  CreatePostDto,
  CreatePostDtoSwaggerBody,
  QueryPostProperty,
  TagDto,
} from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { User as UserEntity } from '../user/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { RolesGuard } from 'src/common/role/roles.guards';
import { Roles } from 'src/common/decorators/role.decorator';
import { FileHelper } from 'src/common/helper/file.helper';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateTagDto } from 'src/tag/dto/update-tag.dto';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: 'create a post' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Post,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'file upload',
    type: CreatePostDtoSwaggerBody,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public', //FileHelper.destinationPath,
        filename: FileHelper.customFileName,
      }),
    }),
  )
  create(
    @User() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.create(createPostDto, user, file);
  }

  @ApiOkResponse({ description: 'list of post search by query' })
  @ApiOperation({ summary: 'get posts by with query' })
  @Get('query')
  getPostByQuery(@Query() query: QueryPostProperty) {
    return this.postService.getPostByQuery(query);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: 'comment to a post' })
  @ApiCreatedResponse({
    description: 'The comment has been successfully created.',
    type: Post,
  })
  @UseGuards(JwtAuthGuard)
  @Post(':slug/comments')
  createPostComment(
    @User() user: UserEntity,
    @Param('slug') slug: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.postService.createPostComment(createCommentDto, user, slug);
  }

  @ApiOperation({ summary: 'get all comments from a post' })
  @ApiOkResponse({ description: 'list of comment from a post' })
  @Get(':slug/comments')
  getPostCommentBySlug(@Param('slug') slug: string) {
    return this.postService.getPostCommentBySlug(slug);
  }

  @ApiOperation({ summary: 'update a post' })
  @ApiBearerAuth('access_token')
  @ApiAcceptedResponse({
    description: 'post updated successfully',
    type: Post,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Author')
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public', //FileHelper.destinationPath,
        filename: FileHelper.customFileName,
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @User() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.postService.update(+id, updatePostDto, user, file);
  }

  @ApiOperation({ summary: 'delete a post' })
  @ApiBearerAuth('access_token')
  @ApiAcceptedResponse({
    description: 'post deleted successfully',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Author')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }

  @Patch(':id/tag/update')
  updateTag(@Param('id') id: string, @Body('tagToUpdate') tagToUpdate: TagDto, @Body('toUpdate') updateTo: TagDto) {
    return this.postService.updateTag(+id, tagToUpdate, updateTo); 
  }

  @Delete(':id/tag/delete')
  removeTag(@Param('id') id: string, @Body() tag: TagDto) {
    return this.postService.removeTag(+id, tag);
  }
}
