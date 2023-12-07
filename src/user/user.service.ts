import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDTO } from './dto/update-user.dto';
import { FilterUserDTO } from './dto/filter-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(filterUserDto: FilterUserDTO): Promise<any> {
    const page = Number(filterUserDto.page) || 1;

    const item_per_page = Number(filterUserDto.item_per_page) || 10;

    const skip = (page - 1) * item_per_page;

    const keyword = filterUserDto.search || '';
    const [res, total] = await this.userRepository.findAndCount({
      where: [
        { first_name: Like('%' + keyword + '%') },
        { last_name: Like('%' + keyword + '%') },
        { email: Like('%' + keyword + '%') },
      ],
      order: { created_at: 'DESC' },
      take: item_per_page,
      skip: skip,
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'status',
        'created_at',
        'updated_at',
      ],
    });

    const lastPage = Math.ceil(total / item_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data: res,
      total: total,
      currentPage: page,
      nextPage,
      prevPage,
      lastPage,
    };
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: id },
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'status',
        'created_at',
        'updated_at',
      ],
    });
  }

  async create(userDto: UserDTO): Promise<UserDTO> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    await bcrypt.hash(userDto.password, salt);
    return await this.userRepository.save(userDto);
  }

  async put(id: number, userDto: UpdateUserDTO): Promise<UpdateResult> {
    return await this.userRepository.update(id, userDto);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  async uploadAvatar(id: number, avatar: string): Promise<UpdateResult> {
    return await this.userRepository.update(id, { avatar });
  }
}
