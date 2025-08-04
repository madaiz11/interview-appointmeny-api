# 📅 Interview Appointment API

A modern, scalable REST API built with NestJS and PostgreSQL for managing interview appointments and scheduling. This system provides comprehensive functionality for managing users, interviewers, candidates, and appointment scheduling with proper role-based access control.

## 🎯 **Project Overview**

The Interview Appointment API is designed to streamline the interview process by providing:

- **User Management** - Comprehensive user profiles with role-based access
- **Account Types** - Support for admins, HR personnel, interviewers, and candidates
- **Interview Scheduling** - Efficient appointment management system
- **Database Migrations** - Version-controlled schema management
- **Health Monitoring** - Application and database health endpoints
- **Docker Support** - Containerized development environment

## 🏗 **Architecture**

### **Technology Stack**

- **Backend Framework**: NestJS (Node.js + TypeScript)
- **Database**: PostgreSQL 15
- **ORM**: TypeORM with migrations
- **Containerization**: Docker & Docker Compose
- **Development**: Hot reload, linting, testing

### **Key Features**

- ✅ **Enterprise-grade architecture** with proper separation of concerns
- ✅ **Database migrations** for safe schema management
- ✅ **Automated seeders** for development data
- ✅ **Health monitoring** endpoints
- ✅ **Environment-based configuration**
- ✅ **Docker development environment**
- ✅ **TypeScript support** with strict typing
- ✅ **Comprehensive documentation**

## 🚀 **Quick Start**

Choose your preferred setup method:

### **🐳 Option 1: Docker (Recommended)**

**Prerequisites:** Docker & Docker Compose

```bash
# Clone and navigate to project
git clone <repository-url>
cd interview-appointmeny-api

# Copy environment template (create if missing)
cp .env.example .env

# Start everything with Docker
docker compose up -d

# Verify services
curl http://localhost:3000/health
```

🎉 **Your API is now running at `http://localhost:3000`**

### **💻 Option 2: Local Development**

**Prerequisites:** Node.js (v20.11+), Docker (for database)

```bash
# Clone and setup project
git clone <repository-url>
cd interview-appointmeny-api
npm install

# Start database services only
docker compose up -d postgres pgadmin

# Setup database and start API locally
npm run migration:run
npm run seed:run
npm run start:dev
```

### **🛠 Option 3: Development with Hot Reload**

**Prerequisites:** Docker & Docker Compose

```bash
# Clone project
git clone <repository-url>
cd interview-appointmeny-api

# Start development environment with hot reload
docker compose --profile dev up -d

# View logs
docker compose logs -f api-dev
```

## 📊 **Service Information**

| Service | URL | Credentials | Docker Profile |
|---------|-----|-------------|----------------|
| **API Server** | `http://localhost:3000` | - | default, dev |
| **PostgreSQL** | `localhost:5433` | `postgres/postgres` | always |
| **PgAdmin** | `http://localhost:8080` | `admin@admin.com/admin` | admin |

### **Docker Profiles**
```bash
# Production setup
docker compose up -d                    # postgres + api

# Development with hot reload  
docker compose --profile dev up -d      # postgres + api-dev

# With database admin interface
docker compose --profile admin up -d    # postgres + api + pgadmin

# Full development setup
docker compose --profile dev --profile admin up -d
```

## 📖 **Documentation**

| Document | Description |
|----------|-------------|
| **[🐳 Docker Setup](docs/DOCKER_SETUP.md)** | **Complete Docker deployment guide** |
| **[🛠 Setup Guide](docs/SETUP.md)** | Local development installation |
| **[📊 Migration Guide](docs/MIGRATION_GUIDE.md)** | Database migrations and seeders |
| **[📋 API Documentation](docs/API.md)** | REST API endpoints and usage |
| **[👨‍💻 Developer Guide](docs/DEVELOPMENT.md)** | Development workflow and guidelines |

## 🗄️ **Database Schema**

### **Core Entities**

```sql
Users (id, email, firstName, lastName, phone, isActive, timestamps)
UserAccounts (id, userId, accountType, department, position, timestamps)
UserSessions (id, userAccountId, createdAt)
```

### **Sample Data**

The system comes pre-configured with sample data:

- **6 Users**: Admin, HR, Interviewers, Candidates
- **6 User Accounts**: Role-based accounts with proper relationships
- **Account Types**: `admin`, `hr`, `interviewer`, `candidate`

## 🛠 **Development**

### **Available Scripts**

#### **🐳 Docker Commands**
```bash
# Production deployment
docker compose up -d                              # Start all services
docker compose down                               # Stop all services
docker compose logs -f api                        # View API logs

# Development with hot reload
docker compose --profile dev up -d                # Start dev environment
docker compose logs -f api-dev                    # View dev logs
docker compose exec api-dev npm run test          # Run tests in container

# Database operations
docker compose exec api npm run migration:run     # Run migrations
docker compose exec api npm run seed:run          # Run seeders
docker compose exec postgres psql -U postgres -d interview_appointment
```

#### **💻 Local Development Scripts**
```bash
# Development
npm run start:dev          # Start with hot reload
npm run build              # Build for production
npm run start:prod         # Start production server

# Database
npm run migration:generate # Generate new migration
npm run migration:run      # Apply migrations
npm run migration:revert   # Rollback last migration
npm run seed:run           # Run database seeders

# Testing
npm run test               # Run unit tests
npm run test:e2e          # Run end-to-end tests
npm run test:cov          # Test coverage

# Code Quality
npm run lint              # ESLint check
npm run format            # Prettier formatting
```

### **Project Structure**

```
interview-appointmeny-api/
├── docs/                  # Documentation files
├── src/
│   ├── config/           # Configuration modules
│   ├── database/         # Migrations & seeders
│   ├── entities/         # TypeORM entities
│   ├── health/           # Health check endpoints
│   ├── app.module.ts     # Main application module
│   └── main.ts           # Application entry point
├── docker-compose.yml    # Development services
├── typeorm.config.ts     # TypeORM CLI configuration
└── .env                  # Environment variables
```

## 🔧 **Configuration**

### **Environment Variables**

Create a `.env` file from the template:

```bash
# Copy template
cp .env.example .env
```

**Key Configuration Options:**

```bash
# Database Configuration
POSTGRES_HOST=localhost              # Use 'postgres' for Docker
POSTGRES_PORT=5433                  # External database port
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=interview_appointment

# Application Settings  
APP_PORT=3000                       # API server port
NODE_ENV=development                # development | production
JWT_SECRET=your-secret-key

# Docker-specific
BUILD_TARGET=production             # production | dev
API_DEBUG_PORT=9229                # Debug port for development

# Admin Tools
PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=admin
PGADMIN_PORT=8080
```

### **Docker vs Local Configuration**

| Setting | Local Development | Docker |
|---------|-------------------|---------|
| `POSTGRES_HOST` | `localhost` | `postgres` |
| `POSTGRES_PORT` | `5433` | `5432` |
| Database access | Host port 5433 | Container port 5432 |

## 🏥 **Health Monitoring**

The API provides comprehensive health monitoring:

```bash
# Application health
GET /health
{
  "status": "ok",
  "timestamp": "2025-08-03T02:33:19.704Z",
  "environment": "development",
  "version": "1.0.0"
}

# Database health
GET /health/db
{
  "status": "ok",
  "database": {
    "type": "postgresql",
    "host": "localhost",
    "port": "5433",
    "database": "interview_appointment",
    "connected": true
  },
  "timestamp": "2025-08-03T02:33:19.704Z"
}
```

## 🚦 **Development Workflow**

### **Adding New Features**

1. **Create entities** in `src/entities/`
2. **Generate migration** using `npm run migration:generate`
3. **Apply migration** with `npm run migration:run`
4. **Create seeders** for sample data
5. **Build API endpoints** and business logic
6. **Add tests** and documentation

### **Database Changes**

1. **Modify entities** with new fields/relationships
2. **Generate migration**: `npm run migration:generate src/database/migrations/FeatureName`
3. **Review generated SQL** in migration file
4. **Apply changes**: `npm run migration:run`
5. **Update seeders** if needed

## 🔒 **Security Features**

- ✅ **Environment-based configuration** with secure defaults
- ✅ **Role-based access control** via user account types
- ✅ **Database connection security** with connection pooling
- ✅ **Input validation** with TypeScript strict mode
- ✅ **Health check endpoints** for monitoring

## 📈 **Performance & Scaling**

- ✅ **Connection pooling** for database efficiency
- ✅ **TypeORM optimizations** with eager/lazy loading
- ✅ **Docker containerization** for consistent deployment
- ✅ **Database indexing** on frequently queried fields
- ✅ **Environment-specific configurations**

## 🤝 **Contributing**

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📝 **API Usage Examples**

```bash
# Check application status
curl http://localhost:3000/health

# Verify database connection
curl http://localhost:3000/health/db

# Future endpoints (coming soon)
# GET /api/users          - List users
# GET /api/appointments   - List appointments
# POST /api/appointments  - Create appointment
```

## 🐛 **Troubleshooting**

### **Common Issues**

- **Port conflicts**: Change `POSTGRES_PORT` in `.env`
- **Docker issues**: Run `docker compose down && docker compose up -d`
- **Migration errors**: Check database connectivity and migration files
- **Seed failures**: Ensure migrations are applied first

### **Getting Help**

- Check the **[Setup Guide](docs/SETUP.md)** for detailed instructions
- Review **[Migration Guide](docs/MIGRATION_GUIDE.md)** for database issues
- Examine application logs for error details
- Verify Docker services are running: `docker compose ps`

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 **Acknowledgments**

- Built with **[NestJS](https://nestjs.com/)** - A progressive Node.js framework
- Database powered by **[PostgreSQL](https://postgresql.org/)**
- ORM provided by **[TypeORM](https://typeorm.io/)**
- Containerization with **[Docker](https://docker.com/)**

---

**Ready to build amazing interview management features? Check out the [Developer Guide](docs/DEVELOPMENT.md) to get started!** 🚀
