import { Body, Controller, Get, HttpCode, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MapInterceptor } from '@automapper/nestjs';
import {
  AuthenticationService,
  LoginEmailDto,
  LoginDto,
  RegisterEmailDto,
  JwtAuthGuard,
  LocalAuthGuard,
} from '@app/authentication';
import { ApiBaseResponse } from '@app/common';

import { User } from '@app/database';
import { UserService, UserDto } from '@app/domain';

@Controller('auth')
@ApiTags('Authentications')
export class AuthController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UserService
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @UseInterceptors(MapInterceptor(User, UserDto))
  getProfile(@Req() req) {
    return this.usersService.findOneById(req.user.id);
  }
}
