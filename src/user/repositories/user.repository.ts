import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ACTIVE_STATUS } from 'src/shared/enum/active-status.enum';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    const qb = this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.userAccount', 'userAccount')
      .leftJoin('user.userSession', 'userSession')
      .select([
        'user.id',
        'user.email',
        'user.name',
        'user.avatarUrl',
        'user.password',
        'userAccount.id',
        'userAccount.accountType',
        'userAccount.department',
        'userAccount.position',
        'userAccount.isActive',
        'userSession.id',
        'userSession.isActive',
      ]);

    qb.where('user.email = :email', { email }).andWhere(
      'user.isActive = :active',
      { active: ACTIVE_STATUS.ACTIVE },
    );
    return qb.getOne();
  }

  async findUserById(id: string): Promise<User | null> {
    const qb = this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.userAccount', 'userAccount')
      .select([
        'user.id',
        'user.email',
        'user.name',
        'user.avatarUrl',
        'userAccount.id',
        'userAccount.accountType',
        'userAccount.department',
        'userAccount.position',
        'userAccount.isActive',
      ]);

    qb.where('user.id = :id', { id }).andWhere('user.isActive = :active', {
      active: ACTIVE_STATUS.ACTIVE,
    });
    return qb.getOne();
  }
}
