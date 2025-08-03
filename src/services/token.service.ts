import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      accounts: user.userAccount,
    };

    return await this.jwtService.signAsync(payload);
  }

  verify(token: string): any {
    return this.jwtService.verify(token);
  }
}
