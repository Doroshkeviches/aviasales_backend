import {
  CanActivate,
  ExecutionContext,
  Injectable,
  createParamDecorator,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UserPermissions } from '@prisma/client';
import { PERMISSION_KEY } from '../decorators/permission.decorator';
import { SecurityService } from '../src';
import { UserSessionDto } from '../src/dtos/UserSessionDto';
import { ApiException } from '../../exceptions/api-exception';
import { ErrorCodes } from '@/src/enums/error-codes.enum';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserSessionDto;
  },
);


@Injectable()
export class JwtAuthGuard
  extends AuthGuard('jwt')
  implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private securityService: SecurityService) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    try {

      const requiredPemissions = this.reflector.getAllAndOverride<UserPermissions[]>(
        PERMISSION_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ]
      );

      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];
      const decodedUser = UserSessionDto.fromPayload(this.jwtService.verify(token));

      request.user = decodedUser
      const user = await this.securityService.getUserById({id: decodedUser.id})
      if (!user) {
        throw new ApiException(ErrorCodes.NotAuthorizedRequest);
      }
      const roleEntity = await this.securityService.getRoleById({id: decodedUser.role_id})
      if (!requiredPemissions) {
        return true;
      }
      return requiredPemissions.some((permission) => roleEntity.permissions?.includes(permission));
    } catch (error) {
      throw new ApiException(ErrorCodes.NotAuthorizedRequest);
    }
  }
}