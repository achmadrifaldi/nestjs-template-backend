import { ApiBaseResponse } from '@app/common';
import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AuthenticationService,
  JwtAuthGuard,
  LocalAuthGuard,
  LoginDto,
  LoginEmailDto,
  RegisterEmailDto,
} from '@app/authentication';
import { User } from '@app/database';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Login with email',
  })
  @ApiBaseResponse(LoginDto)
  @UseGuards(LocalAuthGuard)
  async login(@Body() _body: LoginEmailDto, @Req() req) {
    return this.authenticationService.login(req.user);
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register with email',
  })
  @ApiBaseResponse(User)
  async create(@Body() body: RegisterEmailDto) {
    return this.authenticationService.register(body);
  }
}
