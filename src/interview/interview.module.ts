import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from 'src/entities';
import { InterviewController } from 'src/interview/interview.controller';
import { InterviewService } from 'src/interview/interview.service';
import { InterviewDI } from './di/interview.di';
import { InterviewRepository } from './reporitories/interview.repository';

const persistenceProviders = [
  {
    provide: InterviewDI.repository,
    useClass: InterviewRepository,
  },
  {
    provide: InterviewDI.service,
    useClass: InterviewService,
  },
];

@Module({
  imports: [TypeOrmModule.forFeature([Interview])],
  controllers: [InterviewController],
  providers: [...persistenceProviders],
  exports: [...persistenceProviders],
})
export class InterviewModule {}
