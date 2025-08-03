import { Interview } from 'src/entities/interview.entity';
import { MasterInterviewStatus } from 'src/entities/master-interview-status.entity';
import { User } from 'src/entities/user.entity';
import { MasterInterviewStatusCode } from 'src/shared/enum/master/interview-status-code.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('interview_logs')
export class InterviewLogs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Interview, (interview) => interview.interviewLogs)
  @JoinColumn({ name: 'interview_id' })
  interview: Interview;

  @Column({
    name: 'interview_id',
  })
  interviewId: string;

  @Column({
    name: 'created_by_user_id',
  })
  createdByUserId: string;

  @ManyToOne(() => User, (user) => user.interviewLogs)
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
  })
  description: string;

  @ManyToOne(() => MasterInterviewStatus)
  @JoinColumn({ name: 'master_interview_status_code' })
  interviewStatus: MasterInterviewStatus;

  @Column({
    name: 'master_interview_status_code',
    type: 'varchar',
    length: 5,
  })
  interviewStatusCode: MasterInterviewStatusCode;
}
