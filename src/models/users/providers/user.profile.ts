import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, type Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  fromPaginate(data) {
    console.log(data);
    const items = data.items.map((item: User) => this.mapper.map(item, User, UserDto));
    return {
      ...data,
      items,
    };
  }

  override get profile() {
    return mapper => {
      createMap(mapper, User, UserDto);
    };
  }
}
