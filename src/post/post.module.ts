import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User]), ConfigModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
