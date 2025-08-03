import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from '../../entities/user-account.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserAccountSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
  ) {}

  async seed(): Promise<void> {
    const existingAccounts = await this.userAccountRepository.count();

    if (existingAccounts > 0) {
      console.log(
        '🏢 User accounts already exist, skipping user account seeding',
      );
      return;
    }

    // Get users for account creation
    const adminUser = await this.userRepository.findOne({
      where: { email: 'admin@example.com' },
    });
    const hrUser = await this.userRepository.findOne({
      where: { email: 'hr@example.com' },
    });
    const interviewer1 = await this.userRepository.findOne({
      where: { email: 'interviewer1@example.com' },
    });
    const interviewer2 = await this.userRepository.findOne({
      where: { email: 'interviewer2@example.com' },
    });
    const candidate1 = await this.userRepository.findOne({
      where: { email: 'candidate1@example.com' },
    });
    const candidate2 = await this.userRepository.findOne({
      where: { email: 'candidate2@example.com' },
    });

    const accounts = [
      {
        userId: adminUser?.id,
        accountType: 'admin',
        department: 'IT',
        position: 'System Administrator',
        isActive: true,
      },
      {
        userId: hrUser?.id,
        accountType: 'hr',
        department: 'Human Resources',
        position: 'HR Manager',
        isActive: true,
      },
      {
        userId: interviewer1?.id,
        accountType: 'interviewer',
        department: 'Engineering',
        position: 'Senior Developer',
        isActive: true,
      },
      {
        userId: interviewer2?.id,
        accountType: 'interviewer',
        department: 'Product',
        position: 'Product Manager',
        isActive: true,
      },
      {
        userId: candidate1?.id,
        accountType: 'candidate',
        department: undefined,
        position: 'Software Engineer Applicant',
        isActive: true,
      },
      {
        userId: candidate2?.id,
        accountType: 'candidate',
        department: undefined,
        position: 'UX Designer Applicant',
        isActive: true,
      },
    ];

    let createdCount = 0;
    for (const accountData of accounts) {
      if (accountData.userId) {
        const account = this.userAccountRepository.create(accountData);
        await this.userAccountRepository.save(account);
        console.log(
          `🏢 Created account: ${account.accountType} for user ${account.userId}`,
        );
        createdCount++;
      } else {
        console.log(`⚠️  Skipping account creation - user not found for email`);
      }
    }

    console.log(`✅ Successfully seeded ${createdCount} user accounts`);
  }
}
