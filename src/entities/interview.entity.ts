import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArchiveStatus } from '../shared/enum/archive-status.enum';
import { MasterInterviewStatusCode } from '../shared/enum/master/interview-status-code.enum';
import { InterviewComments } from './interview-comments.entity';
import { InterviewLogs } from './interview-logs.entity';
import { MasterInterviewStatus } from './master-interview-status.entity';
import { User } from './user.entity';

@Entity('interviews')
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({
    name: 'is_archived',
    type: 'smallint',
    default: ArchiveStatus.NOT_ARCHIVED,
  })
  isArchived: ArchiveStatus;

  @ManyToOne(() => MasterInterviewStatus)
  @JoinColumn({ name: 'master_interview_status_code' })
  interviewStatus: MasterInterviewStatus;

  @Column({
    name: 'master_interview_status_code',
    type: 'varchar',
    length: 5,
  })
  interviewStatusCode: MasterInterviewStatusCode;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.interviews)
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: User;

  @Column({
    name: 'created_by_user_id',
  })
  createdByUserId: string;

  @OneToMany(
    () => InterviewComments,
    (interviewComments) => interviewComments.interview,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  interviewComments?: InterviewComments[];

  @OneToMany(() => InterviewLogs, (interviewLogs) => interviewLogs.interview, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  interviewLogs?: InterviewLogs[];
}
