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
import { CreatePostDto, QueryProperty } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { User as UserEntity } from '../user/entities/user.entity';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { RolesGuard } from 'src/common/role/roles.guards';
import { Roles } from 'src/common/decorators/role.decorator';
import { FileHelper } from 'src/common/helper/file.helper';
import { ApiAcceptedResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Post,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public', //FileHelper.destinationPath,
        filename: FileHelper.customFileName 
      }),
    }),
  )
  create(
    @User() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
  ) {
    if (file) {
      const filename = file.filename;
      return this.postService.create(createPostDto, user, filename);
    }
    return this.postService.create(createPostDto, user);
  }

  @ApiOkResponse({description: "list of post search by query"})
  @Get('feed')
  getPostByQuery(@Query() query: QueryProperty) {
    return this.postService.getPostByQuery(query);
  }
  
  @ApiBearerAuth()
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

  @ApiOkResponse({description: "list of comment from a post"})
  @Get(':slug/comments')
  getPostCommentBySlug(@Param('slug') slug: string) {
    return this.postService.getPostCommentBySlug(slug);
  }

  @ApiBearerAuth()
  @ApiAcceptedResponse({
    description: 'update a post',
    type: Post
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Author')
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public', //FileHelper.destinationPath,
        filename: FileHelper.customFileName 
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @User() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const filename = file.filename;
      return this.postService.update(+id, updatePostDto, user, filename);
    }
    return this.postService.update(+id, updatePostDto, user);
  }

  @ApiBearerAuth()
  @ApiAcceptedResponse({
    description: 'delete a post',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Author')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
