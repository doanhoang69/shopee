import { UserRole } from '../../../shared/enum/user-role.enum';

export interface JwtPayload {
  sub: number;
  role: UserRole;
}
