import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';
import { UserRole } from '../../../shared/enum/user-role.enum';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @ValidateIf(
    (o) => o.role === UserRole.CUSTOMER || o.role === UserRole.SHIPPER,
  )
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @ValidateIf(
    (o) => o.role === UserRole.CUSTOMER || o.role === UserRole.SHIPPER,
  )
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @ValidateIf((o) => o.role === UserRole.SELLER)
  @IsString()
  @IsNotEmpty()
  shopName?: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
