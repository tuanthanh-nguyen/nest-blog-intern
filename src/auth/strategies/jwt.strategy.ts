import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { jwtConstants } from '../auth.constants';
import { Cache } from 'cache-manager';
import { UserService } from 'src/user/user.service';
import { timeStamp } from 'console';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any): Promise<User> {
    const userId = payload.id;
    const user = await this.cacheManager.get(userId);
    if (!user) {
      const getUser = await this.userService.findOneByUsername(
        payload.username,
      );
      await this.cacheManager.set(userId, getUser, { ttl: 1000 });
      return getUser;
    }
    // @ts-ignore
    return user;
  }
}
