import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterUserDTO } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterUserDTO) {
    return this.authService.regiter(body);
  }
  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() body: LoginUserDTO) {
    return this.authService.login(body);
  }
  @Post('refresh-token')
  refreshToken(@Body() { refresh_token }): Promise<any> {
    return this.authService.refreshToken(refresh_token);
  }
}
