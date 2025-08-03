import { NestFactory } from '@nestjs/core';
import { UserAccountSeeder } from 'src/database/seeders/user-account.seeder';
import { UserSeeder } from 'src/database/seeders/user.seeder';
import { AppModule } from '../../app.module';

async function runSeeders() {
  console.log('🌱 Starting database seeding...');

  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Run seeders in order
    const userSeeder = app.get(UserSeeder);
    const userAccountSeeder = app.get(UserAccountSeeder);

    console.log('👤 Seeding users...');
    await userSeeder.seed();

    console.log('🏢 Seeding user accounts...');
    await userAccountSeeder.seed();

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

runSeeders();
