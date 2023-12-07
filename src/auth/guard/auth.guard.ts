import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extracTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('SECRET_ACCESS_TOKEN'),
      });
      request['user'] = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private extracTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.header('Authorization');

    if (!authHeader) {
      throw new UnauthorizedException();
    }

    const [type, token] = authHeader.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
