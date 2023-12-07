import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDTO } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDTO } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private useRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
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

    const payload = {
      id: user.id,
      email: user.email,
    };

    return this.generateToken(payload);
  }

  async refreshToken(refresh_token: string): Promise<any> {
    try {
      const verify = await this.jwtService.verifyAsync(refresh_token, {
        secret: this.configService.get('SECRET_REFRESH_TOKEN'),
      });

      const checkUser = await this.useRepository.findOneBy({
        email: verify.email,
        refresh_token,
      });

      if (checkUser) {
        const payload = {
          id: verify.id,
          email: verify.email,
        };
        return this.generateToken(payload);
      } else {
        throw new HttpException(
          'Refresh TOken is not valid',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        'Refresh TOken is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async generateToken(payload: { id: number; email: string }) {
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('SECRET_REFRESH_TOKEN'),
      expiresIn: this.configService.get('EXPIRESIN_REFRESH_TOKEN'),
    });

    await this.useRepository.update(
      {
        email: payload.email,
      },
      { refresh_token },
    );

    return {
      access_token,
      refresh_token,
    };
  }

  async hashPassword(password: string) {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }
}
