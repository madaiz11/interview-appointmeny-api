# 🐳 Docker Quick Reference - Interview Appointment API

**Quick commands for everyday Docker operations with the Interview Appointment API.**

## 🚀 **Essential Commands**

### **Start Services**
```bash
# Production setup
docker compose up -d

# Development with hot reload
docker compose --profile dev up -d

# With database admin
docker compose --profile admin up -d

# Everything (dev + admin)
docker compose --profile dev --profile admin up -d
```

### **Stop Services**
```bash
# Stop all services
docker compose down

# Stop and remove volumes (⚠️ LOSES DATA)
docker compose down -v
```

### **View Status & Logs**
```bash
# Check service status
docker compose ps

# View all logs
docker compose logs

# Follow API logs
docker compose logs -f api

# Follow development API logs
docker compose logs -f api-dev
```

## 🛠 **Development Commands**

### **Database Operations**
```bash
# Run migrations
docker compose exec api npm run migration:run

# Run seeders
docker compose exec api npm run seed:run

# Generate migration
docker compose exec api npm run migration:generate src/database/migrations/NewFeature

# Access database directly
docker compose exec postgres psql -U postgres -d interview_appointment
```

### **Testing**
```bash
# Run tests
docker compose exec api npm run test

# Run e2e tests
docker compose exec api npm run test:e2e

# Test coverage
docker compose exec api npm run test:cov
```

### **Code Quality**
```bash
# Lint code
docker compose exec api npm run lint

# Format code
docker compose exec api npm run format

# Build application
docker compose exec api npm run build
```

## 🔧 **Service Management**

### **Restart Services**
```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart api
docker compose restart postgres
```

### **Update Services**
```bash
# Pull latest images
docker compose pull

# Rebuild services
docker compose build

# Rebuild without cache
docker compose build --no-cache
```

### **Scale Services**
```bash
# Scale API service
docker compose up -d --scale api=3
```

## 🏥 **Health Checks**

### **Application Health**
```bash
# API health
curl http://localhost:3000/health

# Database health
curl http://localhost:3000/health/db

# Expected response
{"status":"ok","timestamp":"..."}
```

### **Service Health**
```bash
# Check Docker health
docker compose ps

# Check container stats
docker stats

# Inspect specific container
docker inspect interview-appointment-api
```

## 🐛 **Troubleshooting**

### **Common Issues**
```bash
# Port conflicts - change in .env
API_PORT=3001
POSTGRES_PORT=5434

# Permission issues (Linux/Mac)
sudo chown -R $USER:$USER .

# Clear Docker cache
docker system prune -a

# View detailed logs
docker compose logs --details
```

### **Debug Container**
```bash
# Access container shell
docker compose exec api bash

# Run commands inside container
docker compose exec api-dev bash

# Check environment variables
docker compose exec api env
```

### **Network Issues**
```bash
# List networks
docker network ls

# Inspect network
docker network inspect interview-api-network

# Test connectivity
docker compose exec api ping postgres
```

## 📁 **File Management**

### **Copy Files**
```bash
# Copy from container
docker compose cp api:/usr/src/app/dist ./local-dist

# Copy to container
docker compose cp ./local-file api:/usr/src/app/
```

### **Volume Management**
```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect interview-appointmeny-api_postgres_data

# Backup database
docker compose exec postgres pg_dump -U postgres interview_appointment > backup.sql
```

## 🔄 **Environment Switching**

### **Development**
```bash
# Set development mode
export NODE_ENV=development
export BUILD_TARGET=dev

# Start development services
docker compose --profile dev up -d
```

### **Production**
```bash
# Set production mode
export NODE_ENV=production
export BUILD_TARGET=production

# Start production services
docker compose up -d
```

## 📊 **Monitoring**

### **Resource Usage**
```bash
# Container stats
docker stats

# Disk usage
docker system df

# Image sizes
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

### **Log Management**
```bash
# View logs with timestamps
docker compose logs -t

# View last N lines
docker compose logs --tail=50

# Save logs to file
docker compose logs > docker-logs.txt
```

## 🌐 **Access Points**

| Service | URL | Purpose |
|---------|-----|---------|
| **API (Production)** | http://localhost:3000 | Main API |
| **API (Development)** | http://localhost:3000 | Development API with hot reload |
| **Health Check** | http://localhost:3000/health | Application health |
| **Database Health** | http://localhost:3000/health/db | Database connectivity |
| **PostgreSQL** | localhost:5433 | Database connection |
| **PgAdmin** | http://localhost:8080 | Database admin UI |

## 🔐 **Default Credentials**

| Service | Username | Password |
|---------|----------|----------|
| **PostgreSQL** | postgres | postgres |
| **PgAdmin** | admin@admin.com | admin |

---

**💡 Tip**: Add these commands to your shell aliases for faster access!

```bash
# Add to ~/.bashrc or ~/.zshrc
alias dc='docker compose'
alias dcup='docker compose up -d'
alias dcdown='docker compose down'
alias dclogs='docker compose logs -f'
alias dcps='docker compose ps'
```