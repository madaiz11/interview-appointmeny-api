import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
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

    // Hash password for all users (using 'password123' as default)
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      {
        email: 'admin@example.com',
        name: 'Admin User',
        avatarUrl:
          'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
        password: hashedPassword,
        isActive: true,
      },
      {
        email: 'hr@example.com',
        name: 'Sarah Johnson',
        avatarUrl:
          'https://ui-avatars.com/api/?name=Sarah+Johnson&background=28A745&color=fff',
        password: hashedPassword,
        isActive: true,
      },
      {
        email: 'interviewer1@example.com',
        name: 'John Smith',
        avatarUrl:
          'https://ui-avatars.com/api/?name=John+Smith&background=FFC107&color=000',
        password: hashedPassword,
        isActive: true,
      },
      {
        email: 'interviewer2@example.com',
        name: 'Emily Davis',
        avatarUrl:
          'https://ui-avatars.com/api/?name=Emily+Davis&background=DC3545&color=fff',
        password: hashedPassword,
        isActive: true,
      },
      {
        email: 'candidate1@example.com',
        name: 'Michael Brown',
        avatarUrl:
          'https://ui-avatars.com/api/?name=Michael+Brown&background=6F42C1&color=fff',
        password: hashedPassword,
        isActive: true,
      },
      {
        email: 'candidate2@example.com',
        name: 'Jessica Wilson',
        avatarUrl:
          'https://ui-avatars.com/api/?name=Jessica+Wilson&background=E83E8C&color=fff',
        password: hashedPassword,
        isActive: true,
      },
    ];

    for (const userData of users) {
      const user = this.userRepository.create(userData);
      await this.userRepository.save(user);
      console.log(`👤 Created user: ${user.name} (${user.email})`);
    }

    console.log(`✅ Successfully seeded ${users.length} users`);
  }
}
