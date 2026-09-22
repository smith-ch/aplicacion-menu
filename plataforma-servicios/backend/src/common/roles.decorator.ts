import { SetMetadata } from '@nestjs/common';
import { Role } from './enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const PUBLIC_KEY = 'isPublic';
/** Ruta accesible sin token; si llega un token válido igual se adjunta el usuario. */
export const Public = () => SetMetadata(PUBLIC_KEY, true);
