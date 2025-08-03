import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InterviewComments } from './interview-comments.entity';
import { InterviewLogs } from './interview-logs.entity';
import { Interview } from './interview.entity';
import { UserAccount } from './user-account.entity';
import { UserSession } from './user-session.entity';

@Index('active_user_index', ['email', 'isActive'])
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatarUrl: string;

  @Column({ select: false, type: 'varchar', length: 255 })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => UserAccount, (userAccount) => userAccount.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  userAccount: UserAccount;

  @OneToOne(() => UserSession, (userSession) => userSession.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  userSession: UserSession;

  @OneToMany(() => Interview, (interview) => interview.createdByUser, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  interviews?: Interview[];

  @OneToMany(
    () => InterviewComments,
    (interviewComments) => interviewComments.createdByUser,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  interviewComments?: InterviewComments[];

  @OneToMany(
    () => InterviewLogs,
    (interviewLogs) => interviewLogs.createdByUser,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  interviewLogs?: InterviewLogs[];
}
