# 🐳 Docker Setup Guide - Interview Appointment API

This guide covers complete Docker setup for the Interview Appointment API, including both development and production environments.

## 🌟 **Overview**

The project includes a comprehensive Docker setup with:

- **Multi-stage Dockerfile** for optimized builds
- **Development and Production** configurations
- **Database and API services** in containers
- **Hot reload** for development
- **Health checks** and proper dependency management
- **Security best practices** with non-root users

## 📋 **Prerequisites**

### **Required Software**
- **Docker**: v20.0+ ([Install Guide](https://docs.docker.com/get-docker/))
- **Docker Compose**: v2.0+ (included with Docker Desktop)
- **Git**: For cloning the repository

### **System Requirements**
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space for images and containers
- **CPU**: 2 cores recommended

### **Verification**
```bash
# Check Docker installation
docker --version          # Should be 20.0+
docker compose version    # Should be v2.0+

# Test Docker functionality
docker run hello-world
```

## 🚀 **Quick Start (Docker Only)**

### **1. Clone and Setup**
```bash
# Clone repository
git clone <repository-url>
cd interview-appointmeny-api

# Copy environment template (create if missing)
cp .env.example .env
```

### **2. Production Deployment**
```bash
# Build and start all services
docker compose up -d

# Verify services are running
docker compose ps

# Check API health
curl http://localhost:3000/health
```

### **3. Development with Hot Reload**
```bash
# Start development environment
docker compose --profile dev up -d

# View logs
docker compose logs -f api-dev

# Access application
curl http://localhost:3000/health
```

🎉 **Your API is now running at `http://localhost:3000`**

## 🏗 **Architecture Overview**

### **Docker Services**

| Service | Purpose | Port | Profile |
|---------|---------|------|---------|
| **postgres** | PostgreSQL database | 5433 | always |
| **api** | Production API server | 3000 | default |
| **api-dev** | Development API (hot reload) | 3000 | dev |
| **pgadmin** | Database admin interface | 8080 | admin |

### **Docker Images**

```
interview-appointment-api:production    # Optimized production image (~200MB)
interview-appointment-api:dev          # Development image with tools (~400MB)
postgres:15-alpine                     # PostgreSQL database (~200MB)
dpage/pgadmin4:latest                 # Database admin UI (~300MB)
```

## 🛠 **Deployment Scenarios**

### **1. Production Deployment**
```bash
# Start production services
docker compose up -d postgres api

# Or with admin interface
docker compose --profile admin up -d
```

**Features:**
- ✅ Optimized production build
- ✅ Multi-stage Docker image
- ✅ Non-root user security
- ✅ Health checks enabled
- ✅ Automatic migrations and seeding

### **2. Development Environment**
```bash
# Start development with hot reload
docker compose --profile dev up -d

# View real-time logs
docker compose logs -f api-dev
```

**Features:**
- ✅ Hot reload on file changes
- ✅ Source code volume mounting
- ✅ Debug port exposed (9229)
- ✅ Development optimizations
- ✅ Full TypeScript support

### **3. Database Only**
```bash
# Start only database services
docker compose up -d postgres pgadmin
```

**Use Case:**
- Run API locally with `npm run start:dev`
- Use containerized database for consistency

## ⚙️ **Configuration**

### **Environment Variables**

Create a `.env` file with these settings:

```bash
# =====================================
# BASIC CONFIGURATION
# =====================================
POSTGRES_HOST=localhost       # Use 'postgres' for Docker
POSTGRES_PORT=5433           # External port
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=interview_appointment

APP_PORT=3000
NODE_ENV=development         # development | production
JWT_SECRET=your-secret-key

# =====================================
# DOCKER-SPECIFIC
# =====================================
BUILD_TARGET=production      # production | dev
API_PORT=3000               # External API port
API_DEBUG_PORT=9229         # Debug port
NETWORK_NAME=interview-api-network

# =====================================
# ADMIN TOOLS
# =====================================
PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=admin
PGADMIN_PORT=8080
```

### **Docker Compose Profiles**

```bash
# Default profile (production)
docker compose up -d                    # postgres + api

# Development profile
docker compose --profile dev up -d      # postgres + api-dev

# Admin profile
docker compose --profile admin up -d    # postgres + api + pgadmin

# All services
docker compose --profile dev --profile admin up -d
```

## 🔧 **Development Workflow**

### **Starting Development**
```bash
# Start development environment
docker compose --profile dev up -d

# Check service status
docker compose ps

# View API logs
docker compose logs -f api-dev

# Access development tools
curl http://localhost:3000/health        # API health
open http://localhost:8080              # PgAdmin (if using admin profile)
```

### **Code Changes**
```bash
# No restart needed - hot reload is enabled
# Edit files in src/ directory
# Changes are automatically detected and reloaded

# View reload logs
docker compose logs -f api-dev
```

### **Database Operations**
```bash
# Run migrations
docker compose exec api-dev npm run migration:run

# Generate new migration
docker compose exec api-dev npm run migration:generate src/database/migrations/NewFeature

# Run seeders
docker compose exec api-dev npm run seed:run

# Access database directly
docker compose exec postgres psql -U postgres -d interview_appointment
```

### **Testing**
```bash
# Run tests inside container
docker compose exec api-dev npm run test

# Run e2e tests
docker compose exec api-dev npm run test:e2e

# Check test coverage
docker compose exec api-dev npm run test:cov
```

## 🏭 **Production Deployment**

### **Environment Setup**
```bash
# Create production environment
cat > .env.production << EOF
NODE_ENV=production
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secure-password-here
POSTGRES_DB=interview_appointment
JWT_SECRET=your-production-secret-32-chars-minimum
APP_PORT=3000
BUILD_TARGET=production
EOF
```

### **Deploy to Production**
```bash
# Build production images
docker compose -f docker-compose.yml --env-file .env.production build

# Start production services
docker compose -f docker-compose.yml --env-file .env.production up -d

# Verify deployment
curl http://your-server:3000/health
```

### **Production Monitoring**
```bash
# Check service health
docker compose ps
docker compose logs api

# Monitor resource usage
docker stats

# Check application health
curl http://localhost:3000/health
curl http://localhost:3000/health/db
```

## 🔍 **Debugging & Troubleshooting**

### **Common Issues**

#### **1. Port Conflicts**
```bash
# Error: "port 3000 is already allocated"
# Solution: Change port in .env
API_PORT=3001
POSTGRES_PORT=5434

# Restart services
docker compose down && docker compose up -d
```

#### **2. Database Connection Issues**
```bash
# Check database status
docker compose ps postgres
docker compose logs postgres

# Test database connectivity
docker compose exec postgres pg_isready -U postgres

# Check API database connection
curl http://localhost:3000/health/db
```

#### **3. Build Failures**
```bash
# Clear Docker cache
docker system prune -a

# Rebuild from scratch
docker compose build --no-cache

# Check Dockerfile syntax
docker build -t test-build .
```

#### **4. Permission Issues**
```bash
# Fix file permissions (Linux/Mac)
sudo chown -R $USER:$USER .

# On Windows, ensure Docker has drive access
# Docker Desktop > Settings > Shared Drives
```

### **Debug Commands**
```bash
# View all container logs
docker compose logs

# Follow specific service logs
docker compose logs -f api-dev

# Execute commands inside containers
docker compose exec api-dev bash
docker compose exec postgres psql -U postgres

# Check container resource usage
docker stats

# Inspect service configuration
docker compose config

# Check network connectivity
docker network ls
docker network inspect interview-api-network
```

### **Health Checks**
```bash
# Application health
curl http://localhost:3000/health
# Expected: {"status":"ok","timestamp":"...","environment":"..."}

# Database health
curl http://localhost:3000/health/db
# Expected: {"status":"ok","database":{...},"timestamp":"..."}

# Container health
docker compose ps
# Expected: All services show "healthy" status
```

## 🔄 **Service Management**

### **Starting Services**
```bash
# Start all default services
docker compose up -d

# Start specific services
docker compose up -d postgres
docker compose up -d api

# Start with profiles
docker compose --profile dev up -d
docker compose --profile admin up -d
```

### **Stopping Services**
```bash
# Stop all services
docker compose down

# Stop specific service
docker compose stop api-dev

# Stop and remove everything (CAUTION: loses data)
docker compose down -v
```

### **Service Updates**
```bash
# Pull latest base images
docker compose pull

# Rebuild services
docker compose build

# Restart with new builds
docker compose down && docker compose up -d --build
```

### **Scaling Services**
```bash
# Scale API service (load balancing)
docker compose up -d --scale api=3

# Note: Requires load balancer configuration
```

## 📊 **Performance Optimization**

### **Docker Image Optimization**
- ✅ **Multi-stage builds** reduce image size by 60%
- ✅ **Alpine Linux** base images for minimal footprint
- ✅ **Layer caching** optimizes build times
- ✅ **Non-root user** improves security
- ✅ **Health checks** ensure service reliability

### **Development Performance**
```bash
# Use bind mounts for faster file syncing
# Already configured in docker-compose.yml

# Optimize Docker Desktop settings
# - Increase memory allocation to 4GB+
# - Enable file sharing for project directory
# - Use Docker Desktop WSL2 backend (Windows)
```

### **Production Performance**
```bash
# Resource limits (add to docker-compose.yml)
deploy:
  resources:
    limits:
      cpus: '2.0'
      memory: 1G
    reservations:
      cpus: '1.0'
      memory: 512M
```

## 🔐 **Security Best Practices**

### **Container Security**
- ✅ **Non-root user** in production containers
- ✅ **Read-only root filesystem** where possible
- ✅ **Minimal base images** (Alpine Linux)
- ✅ **Security scanning** with `docker scan`
- ✅ **Secrets management** via environment variables

### **Network Security**
```bash
# Custom network isolation
# Already configured in docker-compose.yml

# Firewall rules (production)
# Block all ports except 3000 (API) and 5433 (DB)
```

### **Environment Security**
```bash
# Use strong passwords
POSTGRES_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

# Don't commit .env files
echo ".env" >> .gitignore
echo ".env.*" >> .gitignore
```

## 📈 **Monitoring & Logging**

### **Container Monitoring**
```bash
# Real-time logs
docker compose logs -f

# Resource monitoring
docker stats

# Health check monitoring
watch "curl -s http://localhost:3000/health | jq"
```

### **Log Management**
```bash
# Configure log rotation in docker-compose.yml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

## 🎯 **Next Steps**

After successful Docker setup:

1. **Explore API endpoints** - Check [API Documentation](API.md)
2. **Add new features** - Follow [Development Guide](DEVELOPMENT.md) 
3. **Deploy to cloud** - Configure for AWS/GCP/Azure
4. **Set up CI/CD** - Automate building and deployment
5. **Monitor in production** - Add logging and metrics

## 💡 **Tips & Best Practices**

### **Development Tips**
1. Use `docker compose --profile dev` for development
2. Keep containers running and use hot reload
3. Use `docker compose exec` for running commands
4. Monitor logs with `docker compose logs -f`
5. Use PgAdmin for database inspection

### **Production Tips**
1. Use specific image tags, not `latest`
2. Set resource limits for containers
3. Configure health checks and restart policies
4. Use Docker secrets for sensitive data
5. Implement proper backup strategies

### **Performance Tips**
1. Use `.dockerignore` to exclude unnecessary files
2. Optimize Dockerfile layer caching
3. Use multi-stage builds for smaller images
4. Configure Docker Desktop for optimal performance
5. Monitor resource usage regularly

---

**Ready to start building?** 🚀 Your fully containerized development environment is ready!

For additional help, check out:
- **[Setup Guide](SETUP.md)** - Alternative local setup
- **[Development Guide](DEVELOPMENT.md)** - Development workflow
- **[API Documentation](API.md)** - API endpoints and usage