import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed(): Promise<void> {
    const existingUsers = await this.userRepository.count();

    if (existingUsers > 0) {
      console.log('👤 Users already exist, skipping user seeding');
      return;
    }

    const users = [
      {
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        phone: '+1-555-0001',
        isActive: true,
      },
      {
        email: 'hr@example.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        phone: '+1-555-0002',
        isActive: true,
      },
      {
        email: 'interviewer1@example.com',
        firstName: 'John',
        lastName: 'Smith',
        phone: '+1-555-0003',
        isActive: true,
      },
      {
        email: 'interviewer2@example.com',
        firstName: 'Emily',
        lastName: 'Davis',
        phone: '+1-555-0004',
        isActive: true,
      },
      {
        email: 'candidate1@example.com',
        firstName: 'Michael',
        lastName: 'Brown',
        phone: '+1-555-0005',
        isActive: true,
      },
      {
        email: 'candidate2@example.com',
        firstName: 'Jessica',
        lastName: 'Wilson',
        phone: '+1-555-0006',
        isActive: true,
      },
    ];

    for (const userData of users) {
      const user = this.userRepository.create(userData);
      await this.userRepository.save(user);
      console.log(
        `👤 Created user: ${user.firstName} ${user.lastName} (${user.email})`,
      );
    }

    console.log(`✅ Successfully seeded ${users.length} users`);
  }
}
