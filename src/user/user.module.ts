import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserSession } from 'src/entities';
import { UserSessionDI } from 'src/user/di/user-session.di';
import { UserDI } from 'src/user/di/user.di';
import { UserSessionRepository } from 'src/user/repositories/user-session.repository';
import { UserRepository } from 'src/user/repositories/user.repository';

const persistenceProviders = [
  {
    provide: UserDI.repository,
    useClass: UserRepository,
  },
  {
    provide: UserSessionDI.repository,
    useClass: UserSessionRepository,
  },
];

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSession])],
  providers: [...persistenceProviders],
  exports: [...persistenceProviders],
})
export class UserModule {}
