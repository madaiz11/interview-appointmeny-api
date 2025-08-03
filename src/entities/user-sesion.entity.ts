import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity('user_sessions')
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'user_account_id',
  })
  userAccountId: string;

  @ManyToOne(() => UserAccount, (userAccount) => userAccount.id)
  @JoinColumn({ name: 'user_account_id' })
  userAccount: UserAccount;

  @Column()
  createdAt: Date;
}
