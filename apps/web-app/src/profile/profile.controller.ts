import { JwtAuthGuard } from '@app/authentication';
import { UpdateUserDto, UserService } from '@app/features';
import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('profile')
@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'Get current user profile',
  })
  getProfile(@Req() req) {
    return this.userService.findOne(req.user.id);
  }

  @Patch()
  @ApiOperation({
    summary: 'Update current user profile',
  })
  updateProfile(@Req() req, @Body() payload: UpdateUserDto) {
    return this.userService.update({ id: req.user.id, payload, req });
  }
}
