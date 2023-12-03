import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDTO } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDTO } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private useRepository: Repository<User>,
  ) {}

  async regiter(registerDto: RegisterUserDTO): Promise<User> {
    const hashPassword = await this.hashPassword(registerDto.password);

    return this.useRepository.save({
      ...registerDto,
      password: hashPassword,
      refresh_token: 'refreshToken',
    });
  }

  async login(loginDto: LoginUserDTO) {
    const user = await this.useRepository.findOne({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new HttpException('Email not exist', HttpStatus.UNAUTHORIZED);
    }

    const checkPass = bcrypt.compareSync(loginDto.password, user.password);

    if (!checkPass) {
      throw new HttpException('Password not exist', HttpStatus.UNAUTHORIZED);
    }

    
  }

  async hashPassword(password: string) {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }
}
