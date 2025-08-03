import { InterviewComments } from 'src/entities/interview-comments.entity';
import { InterviewLogs } from 'src/entities/interview-logs.entity';
import { MasterInterviewStatus } from 'src/entities/master-interview-status.entity';
import { User } from 'src/entities/user.entity';
import { ArchiveStatus } from 'src/shared/enum/archive-status.enum';
import { MasterInterviewStatusCode } from 'src/shared/enum/master/interview-status-code.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
