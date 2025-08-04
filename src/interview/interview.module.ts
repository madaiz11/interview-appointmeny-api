import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Interview,
  InterviewComments,
  InterviewLogs,
  MasterInterviewStatus,
} from 'src/entities';
import { InterviewLogsDI } from 'src/interview/di/interview-logs.di';
import { InterviewController } from 'src/interview/interview.controller';
import { InterviewService } from 'src/interview/interview.service';
import { InterviewLogsRepository } from 'src/interview/reporitories/interview-logs.repository';
import { InterviewDI } from './di/interview.di';
import { InterviewRepository } from './reporitories/interview.repository';
import { InterviewCommentsRepository } from 'src/interview/reporitories/interview-comments.repoitory';
import { InterviewCommentsDI } from 'src/interview/di/interview-comments.di';

const persistenceProviders = [
  {
    provide: InterviewDI.repository,
    useClass: InterviewRepository,
  },
  {
    provide: InterviewLogsDI.repository,
    useClass: InterviewLogsRepository,
  },
  {
    provide: InterviewCommentsDI.repository,
    useClass: InterviewCommentsRepository,
  },
  {
    provide: InterviewDI.service,
    useClass: InterviewService,
  },
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Interview,
      InterviewLogs,
      MasterInterviewStatus,
      InterviewComments,
    ]),
  ],
  controllers: [InterviewController],
  providers: [...persistenceProviders],
  exports: [...persistenceProviders],
})
export class InterviewModule {}
