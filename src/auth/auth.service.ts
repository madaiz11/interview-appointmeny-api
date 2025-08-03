import { Inject, Injectable } from '@nestjs/common';
import { AuthValidator } from 'src/auth/auth.validator';
import { User } from 'src/entities';
import { TokenService } from 'src/services/token.service';
import { UserSessionDI } from 'src/user/di/user-session.di';
import { UserDI } from 'src/user/di/user.di';
import { UserSessionRepository } from 'src/user/repositories/user-session.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserDI.repository)
    private userRepository: UserRepository,

    @Inject(UserSessionDI.repository)
    private userSessionRepository: UserSessionRepository,

    private tokenService: TokenService,
  ) {}

  async signIn(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Use repository method to find user with password field
    const result = await this.userRepository.findUserByEmail(email);

    AuthValidator.validateUserCredentials(result);

    const user = result!;

    await AuthValidator.validatePassword(password, user);

    AuthValidator.validateUserSession(user);

    const accessToken = await this.tokenService.generateToken(user);

    await this.userSessionRepository.createOrUpdateUserSession(user.id);

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        accounts: user.userAccount,
      },
    };
  }

  async validateUser(userId: string): Promise<User> {
    const result = await this.userRepository.findUserById(userId);

    AuthValidator.validateUserExist(result);

    return result!;
  }

  async signOut(userId: string): Promise<void> {
    await this.userSessionRepository.deactivateUserSession(userId);
  }
}
