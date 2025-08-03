import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Interview } from './interview.entity';
import { User } from './user.entity';

@Entity('interview_comments')
export class InterviewComments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Interview, (interview) => interview.interviewComments)
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

  @ManyToOne(() => User, (user) => user.interviewComments)
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({
    name: 'comment',
    type: 'text',
  })
  comment: string;
}
