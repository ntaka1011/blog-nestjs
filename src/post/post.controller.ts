import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePostDTO } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/helpers/config';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { extname } from 'path';
import { PostService } from './post.service';
import { FilterPostDTO } from './dto/filter-post.dto';
import { Post as PostItem } from './entities/post.entity';
import { UpdatePostDTO } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: storageConfig('post'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowExtArr = ['.jpg', '.png', '.jpeg'];
        if (!allowExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension file. Accepted file ext are: ${allowExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError = `File size is too large. Accepted file size is less than 5 MB`;
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  create(
    @Req() req: any,
    @Body() body: CreatePostDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.postService.create(
      req.user.id,
      file.destination + '/' + file.filename,
      body,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  getAll(@Query() filterPost: FilterPostDTO): Promise<PostItem[]> {
    return this.postService.findAll(filterPost);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number): Promise<PostItem> {
    return this.postService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: storageConfig('post'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowExtArr = ['.jpg', '.png', '.jpeg'];
        if (!allowExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension file. Accepted file ext are: ${allowExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError = `File size is too large. Accepted file size is less than 5 MB`;
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
    @Body() body: UpdatePostDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.postService.update(
      id,
      file.destination + '/' + file.filename,
      body,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.postService.delete(id);
  }
}
