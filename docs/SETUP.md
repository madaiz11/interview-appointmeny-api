# 🛠 Interview Appointment API - Setup Guide

This comprehensive guide covers multiple setup options for the Interview Appointment API. **For the fastest setup, we recommend the Docker approach.**

## 🎯 **Setup Options**

| Option | Best For | Prerequisites | Setup Time |
|--------|----------|---------------|------------|
| **[🐳 Docker](#-docker-setup)** | **Production & Development** | Docker | 5 minutes |
| **[💻 Local Development](#-local-development-setup)** | Local debugging | Node.js + Docker | 10 minutes |
| **[🔄 Hybrid Approach](#-hybrid-approach)** | Database in Docker, API local | Node.js + Docker | 8 minutes |

---

## 🐳 **Docker Setup**

**Recommended for most users - fastest and most reliable setup.**

### **Prerequisites**
- **Docker**: v20.0+ ([Install Guide](https://docs.docker.com/get-docker/))
- **Docker Compose**: v2.0+ (included with Docker Desktop)

### **Quick Start**
```bash
# 1. Clone repository
git clone <repository-url>
cd interview-appointmeny-api

# 2. Copy environment template (create if missing)
cp .env.example .env

# 3. Start everything with one command
docker compose up -d

# 4. Verify setup
curl http://localhost:3000/health
```

### **Development with Hot Reload**
```bash
# Start development environment
docker compose --profile dev up -d

# View logs
docker compose logs -f api-dev

# The API will automatically reload when you change files
```

### **Database Operations**
```bash
# Run migrations
docker compose exec api npm run migration:run

# Run seeders
docker compose exec api npm run seed:run

# Access database
docker compose exec postgres psql -U postgres -d interview_appointment
```

### **Service Management**
```bash
# View all services
docker compose ps

# Stop all services
docker compose down

# Restart specific service
docker compose restart api

# View logs
docker compose logs -f api
```

### **Access Points**
- **API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **Database**: localhost:5433
- **PgAdmin**: http://localhost:8080 (add `--profile admin`)

**✅ Docker setup complete!** For detailed Docker information, see [Docker Setup Guide](DOCKER_SETUP.md).

---

## 💻 **Local Development Setup**

**For developers who prefer running Node.js locally with containerized database.**

## 📋 **Prerequisites**

### **System Requirements**
- **Node.js**: v20.11 or higher ([Download](https://nodejs.org/))
- **Docker**: Latest version ([Install Guide](https://docs.docker.com/get-docker/))
- **Docker Compose**: v2.0+ (included with Docker Desktop)
- **Git**: For version control
- **Package Manager**: npm (included with Node.js) or yarn

### **Recommended Tools**
- **VS Code** with extensions:
  - TypeScript support
  - ESLint
  - Prettier
  - Docker extension
- **Postman** or **Insomnia** for API testing
- **PostgreSQL client** (optional - PgAdmin is included)

### **System Verification**
```bash
# Check Node.js version
node --version  # Should be v20.11+

# Check Docker installation
docker --version
docker compose version

# Check npm version
npm --version
```

## 🚀 **Installation Process**

### **Step 1: Project Setup**
```bash
# Clone the repository
git clone <repository-url>
cd interview-appointmeny-api

# Install all dependencies
npm install

# Verify installation
npm run build
```

### **Step 2: Environment Configuration**
```bash
# Copy environment template
cp .env.example .env
```

**Environment Variables Explained:**
```env
# Database Configuration
POSTGRES_HOST=localhost          # Database host (use 'localhost' for local dev)
POSTGRES_PORT=5433              # Database port (5433 to avoid conflicts)
POSTGRES_USER=postgres          # Database username
POSTGRES_PASSWORD=postgres      # Database password
POSTGRES_DB=interview_appointment # Database name

# Application Configuration
APP_PORT=3000                   # API server port
NODE_ENV=development            # Environment mode (development/production)

# PgAdmin Configuration (Database GUI)
PGADMIN_EMAIL=admin@admin.com   # PgAdmin login email
PGADMIN_PASSWORD=admin          # PgAdmin login password
PGADMIN_PORT=8080              # PgAdmin web interface port

# JWT Configuration (for future authentication)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=1d
```

### **Step 3: Database Services**
```bash
# Start PostgreSQL and PgAdmin containers
docker compose up -d

# Verify services are running
docker compose ps

# Check service logs (if needed)
docker compose logs postgres
docker compose logs pgadmin
```

**Expected Output:**
```
NAME                            IMAGE                   STATUS         PORTS
interview-appointment-db        postgres:15-alpine      Up 2 minutes   0.0.0.0:5433->5432/tcp
interview-appointment-pgadmin   dpage/pgadmin4:latest   Up 2 minutes   0.0.0.0:8080->80/tcp
```

### **Step 4: Database Schema Setup**
```bash
# Apply database migrations
npm run migration:run

# Seed database with sample data
npm run seed:run

# Verify migration status
npm run migration:show
```

### **Step 5: Application Launch**
```bash
# Start in development mode (with hot reload)
npm run start:dev

# Or start in production mode
npm run start:prod
```

**Expected Output:**
```
[Nest] Starting Nest application...
[Nest] InstanceLoader TypeOrmModule dependencies initialized
[Nest] InstanceLoader ConfigModule dependencies initialized
[Nest] InstanceLoader AppModule dependencies initialized
[Nest] Nest application successfully started
🚀 Application is running on: http://localhost:3000
🗄️  Database: localhost:5433/interview_appointment
🌍 Environment: development
```

## ✅ **Verification & Testing**

### **Application Health Checks**
```bash
# Test application health
curl http://localhost:3000/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2025-08-03T02:33:19.704Z",
  "environment": "development",
  "version": "1.0.0"
}

# Test database connectivity
curl http://localhost:3000/health/db

# Expected response:
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

### **Database Verification**
```bash
# Check database contents
docker exec -it interview-appointment-db psql -U postgres -d interview_appointment -c "
SELECT 
  'Users: ' || COUNT(*) FROM users 
UNION ALL 
SELECT 
  'UserAccounts: ' || COUNT(*) FROM user_accounts;
"

# Expected output:
Users: 6
UserAccounts: 6
```

### **PgAdmin Access**
1. Open `http://localhost:8080` in your browser
2. Login with credentials:
   - **Email**: `admin@admin.com`
   - **Password**: `admin`
3. Add server connection:
   - **Host**: `postgres` (Docker container name)
   - **Port**: `5432` (internal Docker port)
   - **Database**: `interview_appointment`
   - **Username**: `postgres`
   - **Password**: `postgres`

## 🏗 **Development Environment**

### **Project Structure Overview**
```
interview-appointmeny-api/
├── docs/                     # 📖 Documentation
│   ├── SETUP.md             # This file
│   ├── MIGRATION_GUIDE.md   # Database management
│   ├── API.md               # API documentation
│   └── DEVELOPMENT.md       # Developer guide
├── src/                      # 💻 Source code
│   ├── config/              # ⚙️ Configuration modules
│   │   ├── env.service.ts   # Environment variables
│   │   └── database.config.ts # Database setup
│   ├── database/            # 🗄️ Database management
│   │   ├── migrations/      # Schema migrations
│   │   └── seeders/        # Sample data
│   ├── entities/            # 📊 Data models
│   │   ├── user.entity.ts   # User model
│   │   ├── user-account.entity.ts # Account model
│   │   └── index.ts        # Entity exports
│   ├── health/             # 🏥 Health monitoring
│   │   ├── health.controller.ts
│   │   ├── health.service.ts
│   │   └── health.module.ts
│   ├── app.module.ts       # 🚀 Main app module
│   └── main.ts             # 🎯 Entry point
├── docker-compose.yml       # 🐳 Development services
├── typeorm.config.ts       # 🔧 TypeORM CLI config
├── .env                    # 🔐 Environment variables
└── .env.example           # 📝 Environment template
```

### **Key Services & Ports**
| Service | URL | Purpose |
|---------|-----|---------|
| **API Server** | `http://localhost:3000` | Main application |
| **PostgreSQL** | `localhost:5433` | Database |
| **PgAdmin** | `http://localhost:8080` | Database GUI |

### **Development Commands**
```bash
# Development server (hot reload)
npm run start:dev

# Build for production
npm run build

# Run tests
npm run test
npm run test:e2e
npm run test:cov

# Code quality
npm run lint
npm run format

# Database operations
npm run migration:generate src/database/migrations/MigrationName
npm run migration:run
npm run migration:revert
npm run seed:run
```

## 🔧 **Configuration Options**

### **Database Configuration**
```typescript
// src/config/database.config.ts
export const createDatabaseConfig = (configService: ConfigService) => ({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  // ... other options
  synchronize: false,        // Use migrations instead
  migrations: ['migrations/*'],
  logging: isDevelopment,    // Log queries in development
})
```

### **Environment Service**
```typescript
// src/config/env.service.ts
@Injectable()
export class EnvService {
  get postgresHost(): string { /* ... */ }
  get postgresPort(): number { /* ... */ }
  get isDevelopment(): boolean { /* ... */ }
  // ... other getters
}
```

## 🛠 **Customization**

### **Port Configuration**
If you need to change ports due to conflicts:

```bash
# Edit .env file
POSTGRES_PORT=5434          # Change database port
APP_PORT=3001              # Change application port
PGADMIN_PORT=8081          # Change PgAdmin port

# Restart services
docker compose down
docker compose up -d
npm run start:dev
```

### **Database Configuration**
```bash
# Change database name
POSTGRES_DB=my_custom_db

# Change credentials
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
```

### **Application Configuration**
```bash
# Enable production mode
NODE_ENV=production

# Configure JWT (for future authentication)
JWT_SECRET=your-production-secret-key
JWT_EXPIRATION=24h
```

## 🐛 **Troubleshooting**

### **Common Issues & Solutions**

#### **1. Port Already in Use**
```bash
# Error: "port 5432 is already allocated"
# Solution: Change the port in .env
POSTGRES_PORT=5434

# Restart services
docker compose down && docker compose up -d
```

#### **2. Docker Permission Issues**
```bash
# On Linux/Mac, you might need sudo
sudo docker compose up -d

# Or add your user to docker group
sudo usermod -aG docker $USER
# Then logout and login again
```

#### **3. Migration Errors**
```bash
# Reset database and migrations
docker compose down -v
docker compose up -d
npm run migration:run
npm run seed:run
```

#### **4. Application Won't Start**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run build
```

#### **5. Database Connection Failed**
```bash
# Check if PostgreSQL is running
docker compose ps

# Check PostgreSQL logs
docker compose logs postgres

# Test direct connection
docker exec -it interview-appointment-db psql -U postgres -d interview_appointment
```

### **Debug Commands**
```bash
# Check all services
docker compose ps

# View application logs
npm run start:dev

# Check database connectivity
curl http://localhost:3000/health/db

# Check environment variables
node -e "console.log(process.env)"

# Verify TypeORM configuration
npm run migration:show
```

## 🔄 **Service Management**

### **Starting Services**
```bash
# Start all services
docker compose up -d

# Start specific service
docker compose up -d postgres
docker compose up -d pgadmin
```

### **Stopping Services**
```bash
# Stop all services
docker compose down

# Stop and remove volumes (CAUTION: loses data)
docker compose down -v

# Stop specific service
docker compose stop postgres
```

### **Service Updates**
```bash
# Pull latest images
docker compose pull

# Rebuild services
docker compose down
docker compose up -d --build
```

## 📊 **Performance Optimization**

### **Development Mode**
- Hot reload enabled
- Detailed logging
- Source maps enabled
- TypeScript checking

### **Production Mode**
```bash
# Build for production
npm run build

# Start in production mode
NODE_ENV=production npm run start:prod
```

### **Database Optimization**
- Connection pooling configured
- Proper indexing on entities
- Query logging in development
- Migration-based schema management

## 🎯 **Next Steps**

Once your environment is set up:

1. **Explore the API** - Check out `docs/API.md`
2. **Learn development workflow** - Read `docs/DEVELOPMENT.md`
3. **Understand migrations** - Review `docs/MIGRATION_GUIDE.md`
4. **Start building features** - Add new entities and endpoints
5. **Run tests** - Ensure code quality with `npm run test`

## 💡 **Tips for Success**

1. **Use environment variables** for all configuration
2. **Always run migrations** before starting development
3. **Seed database** regularly for consistent test data
4. **Monitor health endpoints** to verify system status
5. **Check logs** when troubleshooting issues
6. **Use TypeScript** for type safety and better development experience
7. **Follow migration workflow** for database changes
8. **Document your changes** and update this guide as needed

---

---

## 🔄 **Hybrid Approach**

**Run database in Docker but API locally for debugging flexibility.**

### **Setup**
```bash
# 1. Clone and setup project
git clone <repository-url>
cd interview-appointmeny-api
npm install

# 2. Start only database services
docker compose up -d postgres pgadmin

# 3. Setup environment for local development
cp .env.example .env
# Edit .env to ensure POSTGRES_HOST=localhost

# 4. Setup database and start API
npm run migration:run
npm run seed:run
npm run start:dev
```

### **Benefits**
- ✅ **Full debugging** capabilities with Node.js
- ✅ **Consistent database** environment
- ✅ **IDE integration** for breakpoints
- ✅ **Fast restarts** for API development

### **Use Cases**
- Advanced debugging sessions
- Performance profiling
- IDE-specific tooling
- Custom development workflows

---

## 📊 **Setup Comparison**

| Feature | Docker | Local Development | Hybrid |
|---------|--------|------------------|--------|
| **Setup Speed** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **Consistency** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Debugging** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Production Similarity** | ⭐⭐⭐ | ⭐ | ⭐⭐ |
| **Resource Usage** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

**Need help?** Check the [Developer Guide](DEVELOPMENT.md) or review the [Troubleshooting](#troubleshooting) section above.