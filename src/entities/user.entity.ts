import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserAccount } from './user-account.entity';
import { UserSession } from './user-session.entity';

@Index('active_user_index', ['email', 'isActive'])
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ select: false })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
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
}
