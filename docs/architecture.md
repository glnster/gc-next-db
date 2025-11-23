# System Architecture

## Overview

GC Next DB is a Docker-based development and production scaffold for Next.js applications with Tailwind CSS, Prisma ORM, and PostgreSQL database. It provides a complete containerized environment for both local development and production deployment.

## Architecture Components

### Development Environment

- **Containers**:
  - `app-dev` (from `docker-compose.yml`) - Next.js application
  - `db` - PostgreSQL database
- **Base Images**:
  - Application: `node:20-alpine`
  - Database: `postgres:latest` (PostgreSQL 18)
- **Purpose**: Local development with hot module replacement and database
- **Port**: 3000 (configurable via `.env.development`)
- **Features**:
  - Live reload via Next.js Fast Refresh
  - Volume mounting for source code
  - Development dependencies included
  - PostgreSQL database with persistent storage

### Production Environment

- **Containers**:
  - `app-prod` (from `docker-compose.prod.yml`) - Next.js application
  - `db-prod` - PostgreSQL database
- **Build Process**: Multi-stage Docker build
  - Stage 1: Install dependencies
  - Stage 2: Build Next.js app
  - Stage 3: Serve with standalone Next.js server
- **Base Image**: `node:20-alpine` (all stages)
- **Port**: 3000 (configurable via `NEXT_PORT`)
- **Features**:
  - Optimized production build
  - Standalone Next.js output mode
  - Production database with persistent storage
  - Minimal final image size

## Database Architecture

### PostgreSQL Database

- **Version**: PostgreSQL 18
- **Database Name**: `gc_react_db` (configurable)
- **Schema**: Managed by Prisma ORM
- **Data Models**:
  - Todo: id, title, completed, createdAt, updatedAt
- **Volume Mount**: `/var/lib/postgresql` for PostgreSQL 18+ compatibility
- **Persistent Storage**: Named volumes prevent data loss on container restart

### Prisma ORM

- **Version**: 5.22.0
- **Features**:
  - Type-safe database queries
  - Auto-generated client
  - Migration management
  - Schema-first development
- **Schema Location**: `prisma/schema.prisma`
- **Client Location**: Generated in `node_modules/@prisma/client`

## Docker Setup

### Development Container

The development container runs the Next.js dev server directly, providing:
- Fast hot module replacement via Fast Refresh
- Source maps for debugging
- Full development tooling
- Direct database connection via service name (`db:5432`)

### Production Container

The production container uses a multi-stage build:
1. **Dependencies Stage**: Installs production dependencies
2. **Builder Stage**: Compiles TypeScript and builds the Next.js application
3. **Runner Stage**: Runs the optimized standalone Next.js server

This approach minimizes the final image size while maintaining all build capabilities.

## Container Communication

- Containers communicate through Docker network
- Database accessible via service name (`db` for development, `db-prod` for production)
- Application connects to database using `DATABASE_URL` environment variable
- Database port 5432 exposed for direct access when needed

## Volume Management

### Development
- Source code: Mounted as volume for live reload
- `node_modules`: Named volume to prevent host/container conflicts
- `.next`: Named volume for build cache
- Database: Named volume `postgres_data` for data persistence

### Production
- Database: Named volume `postgres_data_prod` for data persistence
- Static assets: Built into the image (no volumes needed)

## Network Configuration

- Development: Docker Compose network with `app-dev` and `db` services
- Production: Docker Compose network with `app-prod` and `db-prod` services
- Database isolation: Each environment has its own database instance

## Security Considerations

- Production container runs as non-root user (nextjs user)
- Database credentials managed via environment variables
- `.dockerignore` prevents sensitive files from being copied
- Prisma client regenerated during build to prevent tampering
- Database volume mounted with proper permissions
- Environment-specific configuration prevents cross-environment issues

## API Architecture

### REST API Endpoints

- `GET /api/todos` - List all todos
- `POST /api/todos` - Create new todo
- `GET /api/todos/[id]` - Get specific todo
- `PUT /api/todos/[id]` - Update todo
- `DELETE /api/todos/[id]` - Delete todo

### Route Handlers

- Next.js 14 App Router with route handlers
- TypeScript for type safety
- Prisma client for database operations
- Error handling with appropriate HTTP status codes
- JSON responses for all endpoints
