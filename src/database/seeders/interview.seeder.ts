import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from '../../entities/interview.entity';
import { User } from '../../entities/user.entity';
import { MasterInterviewStatusCode } from '../../shared/enum/master/interview-status-code.enum';
import { ArchiveStatus } from '../../shared/enum/archive-status.enum';

@Injectable()
export class InterviewSeeder {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed(): Promise<void> {
    const existingInterviews = await this.interviewRepository.count();

    if (existingInterviews > 0) {
      console.log('📋 Interviews already exist, skipping interview seeding');
      return;
    }

    // Find admin user
    const adminUser = await this.userRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!adminUser) {
      console.error('❌ Admin user not found. Please run user seeder first.');
      return;
    }

    console.log(`👤 Found admin user: ${adminUser.name} (${adminUser.email})`);

    // Sample job positions and departments for realistic interview titles
    const jobPositions = [
      'Frontend Developer',
      'Backend Developer',
      'Full Stack Developer',
      'DevOps Engineer',
      'Product Manager',
      'UI/UX Designer',
      'Data Scientist',
      'QA Engineer',
      'Business Analyst',
      'Marketing Manager',
      'Sales Representative',
      'HR Specialist',
      'Finance Analyst',
      'Project Manager',
      'Software Architect',
      'Mobile Developer',
      'Security Engineer',
      'Database Administrator',
      'Technical Writer',
      'Customer Success Manager',
    ];

    const companies = [
      'Google',
      'Microsoft',
      'Amazon',
      'Meta',
      'Apple',
      'Netflix',
      'Tesla',
      'Spotify',
      'Airbnb',
      'Uber',
      'Stripe',
      'Shopify',
      'Slack',
      'Zoom',
      'Dropbox',
      'Figma',
      'Notion',
      'Linear',
      'Vercel',
      'GitHub',
    ];

    const statusCodes = [
      MasterInterviewStatusCode.TODO,
      MasterInterviewStatusCode.IN_PROGRESS,
      MasterInterviewStatusCode.DONE,
    ];

    const interviewDescriptions = [
      'Technical interview focusing on algorithm and data structure knowledge.',
      'Behavioral interview to assess cultural fit and soft skills.',
      'System design interview for senior engineering position.',
      'Product management case study discussion.',
      'Design challenge presentation and portfolio review.',
      'Leadership and team management assessment.',
      'Sales pitch and customer relationship skills evaluation.',
      'Financial modeling and analytical skills assessment.',
      'Marketing strategy and campaign planning discussion.',
      'Customer service and problem-solving scenario.',
      'Project management methodology and tools assessment.',
      'Quality assurance and testing strategy interview.',
      'DevOps and infrastructure management evaluation.',
      'Data analysis and visualization skills assessment.',
      'Security protocols and best practices discussion.',
      'Database design and optimization interview.',
      'Mobile development framework knowledge assessment.',
      'Cloud architecture and scalability planning.',
      'Agile development and collaboration practices.',
      'User experience research and testing methodology.',
    ];

    const interviews: Partial<Interview>[] = [];

    // Generate 133 mock interviews
    for (let i = 1; i <= 133; i++) {
      const randomPosition =
        jobPositions[Math.floor(Math.random() * jobPositions.length)];
      const randomCompany =
        companies[Math.floor(Math.random() * companies.length)];
      const randomStatus =
        statusCodes[Math.floor(Math.random() * statusCodes.length)];
      const randomDescription =
        interviewDescriptions[
          Math.floor(Math.random() * interviewDescriptions.length)
        ];

      // Create more realistic interview titles
      const titleVariations = [
        `${randomPosition} - ${randomCompany}`,
        `${randomPosition} Position at ${randomCompany}`,
        `${randomCompany} - ${randomPosition} Role`,
        `Interview for ${randomPosition} - ${randomCompany}`,
        `${randomPosition} Opportunity - ${randomCompany}`,
        `${randomCompany} ${randomPosition} Assessment`,
      ];

      const randomTitle =
        titleVariations[Math.floor(Math.random() * titleVariations.length)];

      interviews.push({
        title: `${randomTitle} #${i.toString().padStart(3, '0')}`,
        description: randomDescription,
        isArchived: ArchiveStatus.NOT_ARCHIVED,
        interviewStatusCode: randomStatus,
        createdByUserId: adminUser.id,
        createdAt: new Date(
          Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
        ), // Random date within last 30 days
      });
    }

    // Batch insert interviews
    for (const interviewData of interviews) {
      const interview = this.interviewRepository.create(interviewData);
      await this.interviewRepository.save(interview);

      // Log every 20th interview to show progress
      if (parseInt(interview.title.split('#')[1]) % 20 === 0) {
        console.log(`📋 Created interview: ${interview.title}`);
      }
    }

    console.log(`✅ Successfully seeded ${interviews.length} interviews`);

    // Show status distribution
    const todoCount = interviews.filter(
      (i) => i.interviewStatusCode === MasterInterviewStatusCode.TODO,
    ).length;
    const inProgressCount = interviews.filter(
      (i) => i.interviewStatusCode === MasterInterviewStatusCode.IN_PROGRESS,
    ).length;
    const doneCount = interviews.filter(
      (i) => i.interviewStatusCode === MasterInterviewStatusCode.DONE,
    ).length;

    console.log(`📊 Status distribution:`);
    console.log(`   - TODO: ${todoCount} interviews`);
    console.log(`   - IN_PROGRESS: ${inProgressCount} interviews`);
    console.log(`   - DONE: ${doneCount} interviews`);
  }
}
