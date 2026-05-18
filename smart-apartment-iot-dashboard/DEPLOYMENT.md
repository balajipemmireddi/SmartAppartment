# Deployment Guide

## 🚀 Local Development Deployment

### Prerequisites
- Docker & Docker Compose installed
- Git installed
- 4GB+ RAM available
- Ports 5173, 8000, 5432, 5050 available

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd smart-apartment-iot-dashboard
```

### Step 2: Configure Environment
```bash
cp .env.example .env
# Review and update .env if needed
```

### Step 3: Start Services
```bash
docker-compose up -d
```

### Step 4: Verify Deployment
```bash
# Check services
docker-compose ps

# Check health
curl http://localhost:8000/health

# Access dashboard
open http://localhost:5173
```

---

## 🌐 Production Deployment

### Pre-Deployment Checklist

#### Security
- [ ] Change SECRET_KEY in .env
- [ ] Use strong database password
- [ ] Enable HTTPS/WSS
- [ ] Configure CORS properly
- [ ] Set ENVIRONMENT=production
- [ ] Remove debug mode
- [ ] Enable logging
- [ ] Set up secrets management

#### Performance
- [ ] Optimize database indexes
- [ ] Configure connection pooling
- [ ] Set up caching
- [ ] Enable compression
- [ ] Configure CDN for static files
- [ ] Set up load balancing

#### Monitoring
- [ ] Set up application monitoring
- [ ] Configure error tracking
- [ ] Set up log aggregation
- [ ] Configure alerts
- [ ] Set up health checks
- [ ] Configure backups

#### Infrastructure
- [ ] Choose hosting provider
- [ ] Set up database backups
- [ ] Configure auto-scaling
- [ ] Set up CI/CD pipeline
- [ ] Configure DNS
- [ ] Set up SSL certificates

### Production Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@db-host:5432/smart_apartment
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=40

# Security
SECRET_KEY=<generate-strong-key>
ENVIRONMENT=production

# CORS
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Logging
LOG_LEVEL=INFO
LOG_FILE=/var/log/smart-apartment/app.log

# Frontend
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com
```

### Docker Production Build

```bash
# Build backend image
docker build -t smart-apartment-backend:1.0.0 ./backend

# Build frontend image
docker build -t smart-apartment-frontend:1.0.0 ./frontend

# Tag for registry
docker tag smart-apartment-backend:1.0.0 your-registry/smart-apartment-backend:1.0.0
docker tag smart-apartment-frontend:1.0.0 your-registry/smart-apartment-frontend:1.0.0

# Push to registry
docker push your-registry/smart-apartment-backend:1.0.0
docker push your-registry/smart-apartment-frontend:1.0.0
```

### Production Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always
    networks:
      - smart_apartment_network

  backend:
    image: your-registry/smart-apartment-backend:1.0.0
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      SECRET_KEY: ${SECRET_KEY}
      ENVIRONMENT: production
    ports:
      - "8000:8000"
    depends_on:
      postgres:
        condition: service_healthy
    restart: always
    networks:
      - smart_apartment_network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    image: your-registry/smart-apartment-frontend:1.0.0
    ports:
      - "80:80"
    environment:
      VITE_API_URL: ${VITE_API_URL}
      VITE_WS_URL: ${VITE_WS_URL}
    depends_on:
      - backend
    restart: always
    networks:
      - smart_apartment_network

volumes:
  postgres_data:
    driver: local

networks:
  smart_apartment_network:
    driver: bridge
```

---

## ☁️ Cloud Deployment Options

### AWS Deployment

#### Using ECS
```bash
# Create ECR repositories
aws ecr create-repository --repository-name smart-apartment-backend
aws ecr create-repository --repository-name smart-apartment-frontend

# Push images
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/smart-apartment-backend:1.0.0
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/smart-apartment-frontend:1.0.0

# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier smart-apartment-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username smartapt \
  --master-user-password <strong-password>

# Deploy using ECS Fargate
# (Use AWS Console or CloudFormation)
```

#### Using Elastic Beanstalk
```bash
# Initialize Elastic Beanstalk
eb init -p docker smart-apartment

# Create environment
eb create smart-apartment-env

# Deploy
eb deploy
```

### Heroku Deployment

```bash
# Login to Heroku
heroku login

# Create app
heroku create smart-apartment

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set SECRET_KEY=<key>
heroku config:set ENVIRONMENT=production

# Deploy
git push heroku main
```

### Railway Deployment

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Render Deployment

1. Connect GitHub repository
2. Create new Web Service
3. Configure environment variables
4. Deploy

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build backend
        run: docker build -t backend:${{ github.sha }} ./backend
      
      - name: Build frontend
        run: docker build -t frontend:${{ github.sha }} ./frontend
      
      - name: Push to registry
        run: |
          docker push registry/backend:${{ github.sha }}
          docker push registry/frontend:${{ github.sha }}
      
      - name: Deploy
        run: |
          # Deploy commands here
```

---

## 📊 Database Migration

### Backup Production Database
```bash
# Local backup
docker-compose exec postgres pg_dump -U smartapt smart_apartment > backup.sql

# Remote backup
pg_dump -h <host> -U <user> -d smart_apartment > backup.sql
```

### Restore Database
```bash
# From backup
docker-compose exec -T postgres psql -U smartapt smart_apartment < backup.sql

# Remote restore
psql -h <host> -U <user> -d smart_apartment < backup.sql
```

---

## 🔐 SSL/TLS Setup

### Using Let's Encrypt with Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /ws/live {
        proxy_pass http://backend:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## 📈 Scaling Considerations

### Horizontal Scaling
```yaml
# Multiple backend instances
backend:
  image: smart-apartment-backend:1.0.0
  deploy:
    replicas: 3
  # Load balancer configuration
```

### Database Scaling
- Read replicas for analytics
- Connection pooling (PgBouncer)
- Partitioning for large tables
- Archive old data

### Caching
- Redis for session management
- Cache API responses
- Cache static assets

---

## 🔍 Monitoring & Logging

### Application Monitoring
```bash
# Using Prometheus
docker run -d \
  -p 9090:9090 \
  -v prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus

# Using Grafana
docker run -d \
  -p 3000:3000 \
  grafana/grafana
```

### Log Aggregation
```bash
# Using ELK Stack
docker-compose -f docker-compose.elk.yml up -d

# Using CloudWatch
# Configure AWS CloudWatch agent
```

### Error Tracking
```bash
# Using Sentry
pip install sentry-sdk
# Configure in backend
```

---

## 🚨 Disaster Recovery

### Backup Strategy
- Daily automated backups
- Weekly full backups
- Monthly archive backups
- Test restore procedures

### Backup Commands
```bash
# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T postgres pg_dump -U smartapt smart_apartment > $BACKUP_DIR/backup_$TIMESTAMP.sql
gzip $BACKUP_DIR/backup_$TIMESTAMP.sql
```

### Recovery Procedures
1. Stop application
2. Restore database from backup
3. Verify data integrity
4. Restart application
5. Monitor for issues

---

## 📋 Post-Deployment Checklist

- [ ] All services running
- [ ] Health checks passing
- [ ] Database connected
- [ ] API responding
- [ ] Frontend loading
- [ ] WebSocket connected
- [ ] Real-time updates working
- [ ] Alerts generating
- [ ] Logging configured
- [ ] Monitoring active
- [ ] Backups scheduled
- [ ] SSL/TLS working
- [ ] CORS configured
- [ ] Performance acceptable
- [ ] Security verified

---

## 🔧 Troubleshooting Deployment

### Services won't start
```bash
# Check logs
docker-compose logs

# Rebuild images
docker-compose down
docker-compose up -d --build
```

### Database connection error
```bash
# Check database
docker-compose exec postgres psql -U smartapt -d smart_apartment -c "SELECT 1"

# Check connection string
echo $DATABASE_URL
```

### Frontend not connecting
```bash
# Check API URL
curl http://localhost:8000/health

# Check CORS
curl -H "Origin: http://localhost:5173" http://localhost:8000/api/devices
```

### Performance issues
```bash
# Check database performance
docker-compose exec postgres psql -U smartapt -d smart_apartment -c "EXPLAIN ANALYZE SELECT * FROM telemetry LIMIT 100;"

# Check resource usage
docker stats
```

---

## 📞 Support

### Deployment Issues
1. Check logs: `docker-compose logs -f`
2. Verify health: `curl http://localhost:8000/health`
3. Review documentation
4. Check environment variables

### Performance Issues
1. Monitor resource usage
2. Check database queries
3. Review application logs
4. Optimize indexes

### Security Issues
1. Review security checklist
2. Update dependencies
3. Check access logs
4. Verify SSL/TLS

---

## 📚 Additional Resources

- Docker Documentation: https://docs.docker.com
- FastAPI Deployment: https://fastapi.tiangolo.com/deployment/
- PostgreSQL Backup: https://www.postgresql.org/docs/current/backup.html
- React Production Build: https://react.dev/learn/start-a-new-react-project

---

**Last Updated**: May 2026
**Version**: 1.0.0
