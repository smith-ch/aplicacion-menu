import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from './enums';

export interface AuthUser {
  id: number;
  email: string;
  role: Role;
  name: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser | undefined => ctx.switchToHttp().getRequest().user,
);
