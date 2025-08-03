import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from '../../entities/user-account.entity';
import { UserSession } from '../../entities/user-sesion.entity';
import { User } from '../../entities/user.entity';
import { UserAccountSeeder } from './user-account.seeder';
import { UserSeeder } from './user.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAccount, UserSession])],
  providers: [UserSeeder, UserAccountSeeder],
  exports: [UserSeeder, UserAccountSeeder],
})
export class SeederModule {}
