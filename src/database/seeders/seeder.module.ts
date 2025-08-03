import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from '../../entities/user-account.entity';
import { UserSession } from '../../entities/user-session.entity';
import { User } from '../../entities/user.entity';
import { Interview } from '../../entities/interview.entity';
import { InterviewComments } from '../../entities/interview-comments.entity';
import { InterviewLogs } from '../../entities/interview-logs.entity';
import { MasterInterviewStatus } from '../../entities/master-interview-status.entity';
import { UserAccountSeeder } from './user-account.seeder';
import { UserSeeder } from './user.seeder';
import { InterviewSeeder } from './interview.seeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserAccount,
      UserSession,
      Interview,
      InterviewComments,
      InterviewLogs,
      MasterInterviewStatus,
    ]),
  ],
  providers: [UserSeeder, UserAccountSeeder, InterviewSeeder],
  exports: [UserSeeder, UserAccountSeeder, InterviewSeeder],
})
export class SeederModule {}
