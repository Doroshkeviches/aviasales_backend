import {
  CanActivate,
  ExecutionContext,
  Injectable,
  createParamDecorator,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UserPermissions, UserRoles } from '@prisma/client';
import { PERMISSION_KEY } from '../decorators/permission.decorator';
import { SecurityService } from '../src';
import { UserSessionDto } from '../src/dtos/UserSessionDto';
import { ApiException } from '../../exceptions/api-exception';
import { ErrorCodes } from '@/src/enums/error-codes.enum';
import {ExtendedSocketType} from "@/src/types/extended-socket.type";

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

    const requiredPermissions = this.reflector.getAllAndOverride<UserPermissions[]>(
        PERMISSION_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ]
    );

    const contextType = context.getType();
    let authHeader, decodedUser;
    switch (contextType) {
      case "http":
        const request = context.switchToHttp().getRequest();
        authHeader = request.headers.authorization;
        decodedUser = await this.validateTokenAndGetUser(authHeader);
        request.user = decodedUser;
        return this.validatePermissions(decodedUser, requiredPermissions);
      case "ws":
        const client = context.switchToWs().getData();
        authHeader = client.handshake.headers.authorization;
        decodedUser = await this.validateTokenAndGetUser(authHeader);
        client.user = decodedUser;
        return this.validatePermissions(decodedUser, requiredPermissions);
      default:
        return false;
    }
  }

  private async validateTokenAndGetUser(authHeader: string): Promise<UserSessionDto> {
    const token = authHeader.split(' ')[1];
    const decodedUser = UserSessionDto.fromPayload(this.jwtService.verify(token));
    const user = await this.securityService.getUserById({ id: decodedUser.id });

    if (!user) {
      throw new ApiException(ErrorCodes.NotAuthorizedRequest);
    }

    return decodedUser;
  }

  private async validatePermissions(user: UserSessionDto, requiredPermissions: UserPermissions[]): Promise<boolean> {
    const roleEntity = await this.securityService.getRoleById({ id: user.role_id });

    if (!requiredPermissions) {
      return true;
    }

    if (roleEntity.type === UserRoles.Client) {
      return true;
    }

    const hasPermission = requiredPermissions.some((permission) =>
        roleEntity.permissions?.includes(permission),
    );

    if (!hasPermission) {
      throw new ApiException(ErrorCodes.NotAuthorizedRequest);
    }

    return true;
  }
}