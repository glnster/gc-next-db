# Deployment Guide

## Production Build

The production build uses a multi-stage Docker build process:

1. **Dependencies Stage**: Installs production dependencies
2. **Build Stage**: Compiles TypeScript and builds the Next.js app
3. **Runtime Stage**: Runs the optimized standalone Next.js server

## Environment Variables

Production environment variables in `.env.production`:

- `NODE_ENV`: `production`
- `NEXT_PORT`: Port for Next.js server (default: 3000)
- `DATABASE_URL`: PostgreSQL connection string
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password
- `POSTGRES_DB`: Database name

Example `.env.production`:
```env
NODE_ENV=production
NEXT_PORT=3000
DATABASE_URL=postgresql://postgres:postgres@db-prod:5432/gc_react_db?schema=public
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=gc_react_db
```

**Important**: Change default database credentials for production!

## Deploying to Production

### Using Docker Compose

1. **Update production environment variables:**
   Edit `.env.production` with your production settings

2. **Build and start production containers:**
   ```bash
   ./dock prod
   ```

3. **Or use docker-compose directly:**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

### Manual Deployment

1. **Build the production image:**
   ```bash
   docker build -f Dockerfile.prod -t gc-next-db-prod .
   ```

2. **Run the containers:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Database Migrations

**Important**: Run database migrations before starting the production app:

```bash
# In the production container
docker exec -it gc-next-db-prod npx prisma migrate deploy
```

Or add to your deployment script:
```bash
docker-compose -f docker-compose.prod.yml up -d db-prod
sleep 5  # Wait for database to be ready
docker-compose -f docker-compose.prod.yml run --rm app-prod npx prisma migrate deploy
docker-compose -f docker-compose.prod.yml up -d app-prod
```

### Production Checklist

- [ ] Environment variables set in `.env.production`
- [ ] Database credentials changed from defaults
- [ ] Database migrations applied
- [ ] Database volume configured for persistence
- [ ] Container restart policy set (`unless-stopped`)
- [ ] Logs being collected/monitored
- [ ] Resource limits configured (if needed)
- [ ] Backup strategy in place for database
- [ ] Health checks configured
- [ ] Firewall rules configured (if applicable)

## Database Management

### Backups

**Create database backup:**
```bash
docker exec gc-next-db-prod pg_dump -U postgres gc_react_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

**Restore database:**
```bash
docker exec -i gc-next-db-prod psql -U postgres gc_react_db < backup.sql
```

**Automated backups:**
Create a cron job:
```bash
# Daily backup at 2 AM
0 2 * * * /path/to/backup-script.sh
```

Backup script example:
```bash
#!/bin/bash
BACKUP_DIR="/path/to/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
docker exec gc-next-db-prod pg_dump -U postgres gc_react_db > "${BACKUP_DIR}/backup_${TIMESTAMP}.sql"

# Keep only last 7 days
find ${BACKUP_DIR} -name "backup_*.sql" -mtime +7 -delete
```

### Database Migrations

**Apply pending migrations:**
```bash
docker exec -it gc-next-db-prod npx prisma migrate deploy
```

**Check migration status:**
```bash
docker exec -it gc-next-db-prod npx prisma migrate status
```

**Rollback (manual):**
```bash
# Connect to database
docker exec -it gc-next-db-prod psql -U postgres -d gc_react_db

# Manually revert changes or restore from backup
```

## Scaling Considerations

### Horizontal Scaling

For horizontal scaling:
- Use a load balancer (nginx, HAProxy, cloud load balancer)
- Deploy multiple app container instances
- Use a single shared database or read replicas
- Ensure database connection pooling is configured

Example with multiple app instances:
```yaml
services:
  app-prod-1:
    # ... configuration
  app-prod-2:
    # ... configuration
  db-prod:
    # ... single database for both
```

### Vertical Scaling

Adjust Docker resource limits in docker-compose.prod.yml:

```yaml
services:
  app-prod:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### Database Scaling

- Monitor connection pool usage
- Configure Prisma connection limits
- Consider read replicas for read-heavy workloads
- Optimize queries with indexes

## Monitoring

### Container Health

Check container status:
```bash
./dock status
```

View logs:
```bash
./dock logs app-prod
./dock logs db-prod
```

### Application Logs

Access Next.js logs:
```bash
docker logs -f gc-next-db-prod
```

### Database Logs

Access PostgreSQL logs:
```bash
docker logs -f gc-next-db-prod
```

### Resource Monitoring

Monitor resource usage:
```bash
docker stats gc-next-db-prod gc-next-db-prod
```

### Database Monitoring

Connect to database:
```bash
docker exec -it gc-next-db-prod psql -U postgres -d gc_react_db
```

Check active connections:
```sql
SELECT count(*) FROM pg_stat_activity;
```

Check database size:
```sql
SELECT pg_size_pretty(pg_database_size('gc_react_db'));
```

## Security Best Practices

1. **Change default credentials:**
   - Update `POSTGRES_PASSWORD` in `.env.production`
   - Use strong, unique passwords

2. **Environment variables:**
   - Never commit `.env.production` to git
   - Use secrets management in CI/CD

3. **Database access:**
   - Limit database port exposure (remove ports mapping if not needed)
   - Use firewall rules to restrict access
   - Consider connection encryption with SSL

4. **Container security:**
   - Run as non-root user (already configured)
   - Keep base images updated
   - Scan for vulnerabilities

5. **API security:**
   - Implement authentication
   - Add rate limiting
   - Validate all inputs
   - Use CORS appropriately

## Troubleshooting

**Container won't start:**
- Check environment variables
- Verify database connectivity
- Check logs: `./dock logs`
- Ensure ports aren't in use

**Database connection errors:**
- Verify DATABASE_URL is correct
- Check database container is running
- Verify credentials
- Check network connectivity

**Migration errors:**
- Check Prisma schema syntax
- Verify database permissions
- Check for conflicting migrations
- Review migration history

**Performance issues:**
- Check database query performance
- Monitor resource usage
- Review Prisma query logs
- Add database indexes
- Configure connection pooling

**Data loss:**
- Ensure volumes are properly mounted
- Check backup schedule
- Test restore procedures
- Monitor disk space

## Health Checks

Add health checks to docker-compose.prod.yml:

```yaml
services:
  app-prod:
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  db-prod:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
```
