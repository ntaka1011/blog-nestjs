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
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UserDTO } from './dto/user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { FilterUserDTO } from './dto/filter-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/helpers/config';
import { extname } from 'path';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'item_per_page' })
  @ApiQuery({ name: 'search', required: false })
  @Get()
  findAll(@Query() filterUser: FilterUserDTO): Promise<User[]> {
    console.log(
      '🚀 ~ file: user.controller.ts:27 ~ UserController ~ findAll ~ filterUser:',
      filterUser,
    );
    return this.userService.findAll(filterUser);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() userDto: UserDTO): Promise<any> {
    return this.userService.create(userDto);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  put(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDTO,
  ): Promise<any> {
    return this.userService.put(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.userService.delete(id);
  }

  @Post('upload-avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: storageConfig('avatar'),
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
  uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.userService.uploadAvatar(
      req.user.id,
      file.destination + '/' + file.filename,
    );
  }
}
