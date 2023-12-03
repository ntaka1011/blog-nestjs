import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDTO } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDTO } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterUserDTO) {
    return this.authService.regiter(body);
  }
  @Post('login')
  login(@Body() body: LoginUserDTO) {
    
  }
}
