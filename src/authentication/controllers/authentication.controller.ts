import { Body, Controller, Get, HttpCode, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiBaseResponse } from '../../common/decorators/api-base-response.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { User } from '../../models/users/entities/user.entity';
import { UsersService } from '../../models/users/providers/users.service';
import { AuthenticationService } from '../providers/authentication.service';
import { LoginEmailDto } from '../dto/login-email.dto';
import { LoginDto } from '../dto/login.dto';
import { RegisterEmailDto } from '../dto/register-email.dto';
import { MapInterceptor } from '@automapper/nestjs';
import { UserDto } from '../../models/users/dto/user.dto';

@Controller('authentication')
@ApiTags('Authentication')
export class AuthenticationController {
  constructor(
    private authenticationService: AuthenticationService,
    private usersService: UsersService
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
