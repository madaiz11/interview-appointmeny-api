import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { AuthErrorCode } from 'src/shared/enum/error-codes/auth.error-code.enum';

@Injectable()
export class AuthValidator {
  static validateUserCredentials(user: User | null) {
    if (!user) {
      throw new UnauthorizedException(AuthErrorCode.INVALID_CREDENTIALS);
    }
  }

  static validateUserExist(user: User | null) {
    if (!user) {
      throw new UnauthorizedException(AuthErrorCode.USER_NOT_FOUND);
    }
  }

  static async validatePassword(password: string, user: User) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(AuthErrorCode.PASSWORD_NOT_MATCH);
    }
  }

  static validateUserSession(user: User) {
    if (user?.userSession?.isActive) {
      throw new UnauthorizedException(AuthErrorCode.USER_ALREADY_LOGIN);
    }
  }
}
