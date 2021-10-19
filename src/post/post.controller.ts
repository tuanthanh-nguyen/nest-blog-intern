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
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file',
      {
        storage: diskStorage({
          destination: './public', 
          filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
          return cb(null, `${randomName}${extname(file.originalname)}`)
        }
        })
      }
    )
  )
  create(
    @User() user,
    @UploadedFile() file: Express.Multer.File, 
    @Body() createPostDto: CreatePostDto) {
      const filePath = {file: file.filename};
      const authorId = {author: user.userId};
      const createPostEntity = Object.assign({}, createPostDto, filePath, authorId);
      return this.postService.create(createPostEntity);
  }

  // @Get()
  // findAll() {
  //   return this.postService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Get()
  findByTitle(@Query() query) {
    console.log(query)
    return this.postService.findByTitle(query.title);
  }


  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file',
    {
      storage: diskStorage({
        destination: './public', 
        filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        return cb(null, `${randomName}${extname(file.originalname)}`)
      }
      })
    }
  )
  )
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @User() user,
    @UploadedFile() file: Express.Multer.File) {
      const filePath = { file: file.filename };
      const authorId = { author: user.UserId};
      const updatePostEntity = Object.assign({}, updatePostDto, filePath, authorId);
      return this.postService.update(+id, updatePostEntity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
