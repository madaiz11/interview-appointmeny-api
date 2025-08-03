# 🗄️ Database Migration & Seeder Guide

This comprehensive guide covers database management, migrations, and data seeding for the Interview Appointment API.

## 📋 **Overview**

The Interview Appointment API uses **TypeORM migrations** for database schema management and **automated seeders** for development data. This approach provides:

- ✅ **Version Control** - Track all database changes
- ✅ **Team Collaboration** - Synchronized schema across environments
- ✅ **Production Safety** - Safe, reversible database updates
- ✅ **Data Consistency** - Automated sample data generation

## 🏗 **Migration System**

### **Current Infrastructure Status**
- ✅ **Migration System**: Fully configured and operational
- ✅ **Initial Schema**: Generated and applied (3 migrations)
- ✅ **Current Entities**: User, UserAccount, UserSession
- ✅ **CLI Integration**: TypeORM CLI with npm scripts
- ✅ **Auto-Sync Disabled**: Using migrations for safety

### **Migration Commands**
```bash
# Generate migration from entity changes
npm run migration:generate src/database/migrations/MigrationName

# Create empty migration file
npm run migration:create src/database/migrations/MigrationName

# Apply pending migrations
npm run migration:run

# Rollback last migration
npm run migration:revert

# Show migration status
npm run migration:show

# Direct TypeORM CLI access
npm run typeorm -- --help
```

### **Migration Workflow**

#### **1. Adding New Features**
```bash
# 1. Create or modify entities
# src/entities/appointment.entity.ts

# 2. Generate migration
npm run migration:generate src/database/migrations/AddAppointments

# 3. Review generated SQL
# Check the migration file in src/database/migrations/

# 4. Apply migration
npm run migration:run

# 5. Commit changes
git add .
git commit -m "Add appointments table and migration"
```

#### **2. Modifying Existing Entities**
```bash
# 1. Update entity definition
# Add/remove/modify fields in existing entities

# 2. Generate migration
npm run migration:generate src/database/migrations/UpdateUserFields

# 3. Review and test migration
npm run migration:run

# 4. Update seeders if needed
# Modify existing seeders to match new schema

# 5. Test with fresh database
docker compose down -v
docker compose up -d
npm run migration:run
npm run seed:run
```

### **Migration Best Practices**

#### **✅ Do's**
- **Always review** generated migrations before applying
- **Test migrations** on development environment first
- **Use descriptive names** for migration files
- **Keep migrations focused** - one feature per migration
- **Backup production** before running migrations
- **Run migrations in CI/CD** pipeline

#### **❌ Don'ts**
- **Never edit applied migrations** - create new ones instead
- **Don't use auto-sync** in production
- **Avoid manual database changes** - use migrations
- **Don't skip migration review** - SQL can be destructive
- **Never force push** migration changes

### **Migration File Structure**
```typescript
// Example migration file
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAppointments1754188194265 implements MigrationInterface {
    name = 'AddAppointments1754188194265'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Forward migration - create tables/columns
        await queryRunner.query(`
            CREATE TABLE "appointments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" varchar NOT NULL,
                "scheduledAt" TIMESTAMP NOT NULL,
                CONSTRAINT "PK_appointments" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Rollback migration - remove changes
        await queryRunner.query(`DROP TABLE "appointments"`);
    }
}
```

## 🌱 **Seeder System**

### **Current Seeders**
- ✅ **UserSeeder**: Creates 6 sample users with different roles
- ✅ **UserAccountSeeder**: Creates corresponding user accounts
- ✅ **Seeder Module**: Proper NestJS dependency injection
- ✅ **Relationship Management**: Ensures referential integrity

### **Seeding Commands**
```bash
# Run all seeders
npm run seed:run

# Create new seeder (manual process)
# 1. Create seeder file in src/database/seeders/
# 2. Register in SeederModule
# 3. Add to run-seeders.ts

# Reset and re-seed database
docker exec -it interview-appointment-db psql -U postgres -d interview_appointment -c "
DELETE FROM user_accounts; 
DELETE FROM users;
"
npm run seed:run
```

### **Current Sample Data**

#### **Users Created (6 total)**
| Email | Name | Role | Department |
|-------|------|------|------------|
| `admin@example.com` | Admin User | System Administrator | IT |
| `hr@example.com` | Sarah Johnson | HR Manager | Human Resources |
| `interviewer1@example.com` | John Smith | Senior Developer | Engineering |
| `interviewer2@example.com` | Emily Davis | Product Manager | Product |
| `candidate1@example.com` | Michael Brown | Software Engineer Applicant | - |
| `candidate2@example.com` | Jessica Wilson | UX Designer Applicant | - |

#### **Account Type Distribution**
| Account Type | Count | Purpose |
|--------------|-------|---------|
| `admin` | 1 | System administration |
| `hr` | 1 | Human resources management |
| `interviewer` | 2 | Conduct interviews |
| `candidate` | 2 | Interview participants |

#### **Database Verification**
```bash
# Check seeded data
docker exec -it interview-appointment-db psql -U postgres -d interview_appointment -c "
SELECT 
    u.email, 
    u.\"firstName\", 
    u.\"lastName\", 
    ua.\"accountType\", 
    ua.department 
FROM users u 
JOIN user_accounts ua ON u.id = ua.\"userId\" 
ORDER BY ua.\"accountType\";
"
```

### **Creating Custom Seeders**

#### **1. Seeder File Structure**
```typescript
// src/database/seeders/appointment.seeder.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../../entities/appointment.entity';

@Injectable()
export class AppointmentSeeder {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async seed(): Promise<void> {
    const existingCount = await this.appointmentRepository.count();
    
    if (existingCount > 0) {
      console.log('🗓️ Appointments already exist, skipping seeding');
      return;
    }

    const appointments = [
      {
        title: 'Frontend Developer Interview',
        scheduledAt: new Date('2025-08-05 10:00:00'),
        // ... other fields
      },
      // ... more appointments
    ];

    for (const appointmentData of appointments) {
      const appointment = this.appointmentRepository.create(appointmentData);
      await this.appointmentRepository.save(appointment);
      console.log(`🗓️ Created appointment: ${appointment.title}`);
    }

    console.log(`✅ Successfully seeded ${appointments.length} appointments`);
  }
}
```

#### **2. Register in Seeder Module**
```typescript
// src/database/seeders/seeder.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([
    User, 
    UserAccount, 
    UserSession,
    Appointment  // Add new entity
  ])],
  providers: [
    UserSeeder, 
    UserAccountSeeder,
    AppointmentSeeder  // Add new seeder
  ],
  exports: [
    UserSeeder, 
    UserAccountSeeder,
    AppointmentSeeder  // Export new seeder
  ],
})
export class SeederModule {}
```

#### **3. Add to Runner**
```typescript
// src/database/seeders/run-seeders.ts
async function runSeeders() {
  console.log('🌱 Starting database seeding...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const userSeeder = app.get(UserSeeder);
    const userAccountSeeder = app.get(UserAccountSeeder);
    const appointmentSeeder = app.get(AppointmentSeeder);  // Add new seeder
    
    console.log('👤 Seeding users...');
    await userSeeder.seed();
    
    console.log('🏢 Seeding user accounts...');
    await userAccountSeeder.seed();
    
    console.log('🗓️ Seeding appointments...');  // Add seeding step
    await appointmentSeeder.seed();
    
    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}
```

## 📊 **Database Schema**

### **Current Schema Structure**
```sql
-- Users table (core user information)
CREATE TABLE "users" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "email" varchar UNIQUE NOT NULL,
    "firstName" varchar NOT NULL,
    "lastName" varchar NOT NULL,
    "phone" varchar,
    "isActive" boolean DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT now(),
    "updatedAt" TIMESTAMP DEFAULT now()
);

-- User accounts (role-based access)
CREATE TABLE "user_accounts" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "accountType" varchar NOT NULL,
    "department" varchar,
    "position" varchar,
    "isActive" boolean DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT now(),
    "updatedAt" TIMESTAMP DEFAULT now()
);

-- User sessions (tracking)
CREATE TABLE "user_sessions" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_account_id" uuid NOT NULL REFERENCES "user_accounts"("id"),
    "createdAt" TIMESTAMP NOT NULL
);

-- Migrations tracking
CREATE TABLE "migrations" (
    "id" SERIAL PRIMARY KEY,
    "timestamp" bigint NOT NULL,
    "name" varchar NOT NULL
);
```

### **Entity Relationships**
```
User (1) ──► (1..n) UserAccount ──► (1..n) UserSession
```

## 🔄 **Migration vs Auto-Sync Comparison**

| Feature | Auto-Sync (Previous) | Migrations (Current) |
|---------|---------------------|----------------------|
| **Development Speed** | ⚡ Very Fast | 🐌 Moderate |
| **Production Safety** | ❌ Dangerous | ✅ Safe |
| **Version Control** | ❌ None | ✅ Full History |
| **Data Preservation** | ❌ Can Lose Data | ✅ Preserves Data |
| **Team Collaboration** | ❌ Conflicts | ✅ Coordinated |
| **Rollback Support** | ❌ Not Possible | ✅ Full Rollback |
| **Schema Documentation** | ❌ None | ✅ Self-Documented |

## 🚀 **Quick Start Guide**

### **New Developer Setup**
```bash
# 1. Clone and install
git clone <repo> && cd interview-appointmeny-api
npm install

# 2. Start services
docker compose up -d

# 3. Apply migrations
npm run migration:run

# 4. Seed database
npm run seed:run

# 5. Start development
npm run start:dev
```

### **Adding New Features**
```bash
# 1. Create entity
# src/entities/appointment.entity.ts

# 2. Export entity
# Add to src/entities/index.ts

# 3. Generate migration
npm run migration:generate src/database/migrations/AddAppointments

# 4. Apply migration
npm run migration:run

# 5. Create seeder (optional)
# Follow seeder creation guide above
```

## 🚦 **Production Deployment**

### **Deployment Checklist**
```bash
# 1. Build application
npm run build

# 2. Set production environment
export NODE_ENV=production

# 3. Backup production database
pg_dump -h $PROD_HOST -U $PROD_USER $PROD_DB > backup.sql

# 4. Apply migrations
npm run migration:run

# 5. Start application
npm run start:prod

# 6. Verify deployment
curl $PROD_URL/health/db
```

### **Production Migration Strategy**
1. **Schedule maintenance window**
2. **Create database backup**
3. **Test migrations on staging**
4. **Apply migrations to production**
5. **Deploy new application version**
6. **Verify system health**
7. **Monitor for issues**

## 🐛 **Troubleshooting**

### **Common Migration Issues**

#### **Migration Generation Fails**
```bash
# Check entity syntax
npm run build

# Verify TypeORM configuration
npm run typeorm -- --help

# Check database connection
npm run migration:show
```

#### **Migration Application Fails**
```bash
# Check database connectivity
docker compose ps
docker compose logs postgres

# Verify migration file syntax
# Review generated SQL in migration file

# Reset if necessary (DEVELOPMENT ONLY)
docker compose down -v
docker compose up -d
npm run migration:run
```

#### **Seeder Failures**
```bash
# Check if migrations are applied
npm run migration:show

# Verify entity relationships
# Check foreign key constraints

# Clear existing data
docker exec -it interview-appointment-db psql -U postgres -d interview_appointment -c "
DELETE FROM user_accounts; 
DELETE FROM users;
"

# Re-run seeders
npm run seed:run
```

### **Database Connection Issues**
```bash
# Check services
docker compose ps

# Test direct connection
docker exec -it interview-appointment-db psql -U postgres -d interview_appointment

# Verify environment variables
echo $POSTGRES_HOST $POSTGRES_PORT $POSTGRES_DB

# Check application configuration
curl http://localhost:3000/health/db
```

## 📈 **Advanced Usage**

### **Custom Migration Scripts**
```typescript
// Complex migration example
export class AddAdvancedAppointments1754188194265 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create table
        await queryRunner.query(`CREATE TABLE "appointments" (...)`);
        
        // Add indexes
        await queryRunner.query(`CREATE INDEX "IDX_appointments_scheduled_at" ON "appointments" ("scheduledAt")`);
        
        // Insert initial data
        await queryRunner.query(`INSERT INTO "appointments" (...) VALUES (...)`);
        
        // Update existing data
        await queryRunner.query(`UPDATE "users" SET "isActive" = true WHERE "isActive" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverse all changes
        await queryRunner.query(`DROP TABLE "appointments"`);
    }
}
```

### **Conditional Seeders**
```typescript
// Environment-specific seeding
@Injectable()
export class ConditionalSeeder {
  constructor(private envService: EnvService) {}

  async seed(): Promise<void> {
    if (this.envService.isProduction) {
      console.log('⚠️ Skipping seeding in production');
      return;
    }

    if (this.envService.isTest) {
      await this.seedTestData();
    } else {
      await this.seedDevelopmentData();
    }
  }
}
```

## 📝 **Configuration Files**

### **TypeORM CLI Configuration**
```typescript
// typeorm.config.ts
export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT) || 5433,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'interview_appointment',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,  // Never use auto-sync
  logging: true,       // Enable query logging
});
```

### **Package.json Scripts**
```json
{
  "scripts": {
    "typeorm": "typeorm-ts-node-commonjs",
    "migration:generate": "npm run typeorm -- migration:generate --dataSource=typeorm.config.ts",
    "migration:create": "npm run typeorm -- migration:create",
    "migration:run": "npm run typeorm -- migration:run --dataSource=typeorm.config.ts",
    "migration:revert": "npm run typeorm -- migration:revert --dataSource=typeorm.config.ts",
    "migration:show": "npm run typeorm -- migration:show --dataSource=typeorm.config.ts",
    "seed:run": "ts-node -r tsconfig-paths/register src/database/seeders/run-seeders.ts"
  }
}
```

## 🎯 **Next Steps**

1. **Create new entities** for your business logic
2. **Generate migrations** for schema changes
3. **Build seeders** for development data
4. **Test migration workflow** in development
5. **Plan production deployment** strategy
6. **Monitor database performance** and optimize as needed

---

**Your database is now fully configured with enterprise-grade migration and seeding capabilities!** 🎉

For more information, check out:
- **[Setup Guide](SETUP.md)** - Initial project setup
- **[Development Guide](DEVELOPMENT.md)** - Development workflow
- **[API Documentation](API.md)** - REST API reference