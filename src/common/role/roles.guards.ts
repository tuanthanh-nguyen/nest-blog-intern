import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PostService } from 'src/post/post.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
      private reflector: Reflector,
        private readonly postService: PostService 
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const post = await this.postService.findOne(request.param.id);
        return user.id === post.author.id;
        // return matchRoles(roles, user.roles);
    }
}
