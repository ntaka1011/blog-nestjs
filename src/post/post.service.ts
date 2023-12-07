import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { CreatePostDTO } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { FilterPostDTO } from './dto/filter-post.dto';
import { UpdatePostDTO } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRespository: Repository<Post>,
    @InjectRepository(User) private userRespository: Repository<User>,
  ) {}

  async create(
    userId: number,
    thumbnail: string,
    createPost: CreatePostDTO,
  ): Promise<Post> {
    const user = await this.userRespository.findOneBy({ id: userId });

    try {
      const post = await this.postRespository.save({
        ...createPost,
        thumbnail,
        user,
      });

      return await this.postRespository.findOne({
        where: { id: post.id },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException('Can not create post', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(filterPost: FilterPostDTO): Promise<any> {
    const page = Number(filterPost.page) || 1;

    const item_per_page = Number(filterPost.item_per_page) || 10;

    const keyword = filterPost.search || '';

    const skip = (page - 1) * item_per_page;

    const categoryId = Number(filterPost.category) || null;

    try {
      const [res, total] = await this.postRespository.findAndCount({
        order: { created_at: 'DESC' },
        where: [
          {
            title: Like('%' + `${keyword}` + '%'),
            category: {
              id: categoryId,
            },
          },
        ],
        take: item_per_page,
        skip: skip,
        relations: {
          user: true,
          category: true,
        },
      });
      console.log(
        '🚀 ~ file: post.service.ts:56 ~ PostService ~ findAll ~ res:',
        res,
      );

      const lastPage = Math.ceil(total / item_per_page);
      const nextPage = page + 1 > lastPage ? null : page + 1;
      const prevPage = page - 1 < 1 ? null : page - 1;

      return {
        data: res,
        total,
        currentPage: page,
        lastPage,
        nextPage,
        prevPage,
      };
    } catch (error) {
      throw new HttpException('Can not get all post', HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number): Promise<Post> {
    return await this.postRespository.findOne({ where: { id } });
  }

  async update(
    id: number,
    thumbnail: string,
    updatePost: UpdatePostDTO,
  ): Promise<UpdateResult> {
    return await this.postRespository.update(id, { ...updatePost, thumbnail });
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.postRespository.delete(id);
  }
}
