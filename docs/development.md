# Development Guide

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gc-next-db
   ```

2. **Start development environment**
   ```bash
   ./dock dev
   ```

3. **Open your browser**
   - Navigate to `http://localhost:3000`

## Development Workflow

### Starting Development

Use the `dock` helper script to start the development container:

```bash
./dock dev
```

This will:
- Stop any running containers
- Build the development container
- Start both app and database containers
- Run Prisma database migrations
- Start Next.js dev server with live reload
- Follow logs in the terminal

### Working with the Container

**View logs:**
```bash
./dock logs
```

**Open a shell in the container:**
```bash
./dock shell
```

**Check container status:**
```bash
./dock status
```

**Stop the container:**
```bash
./dock stop
```

**Start in detached mode:**
```bash
./dock detached
```

### Hot Module Replacement

The development environment uses Next.js Fast Refresh:
- Changes to source files are automatically reflected in the browser
- React component state is preserved during updates
- Fast feedback loop for development
- Automatic compilation of TypeScript and CSS

### Database Management

#### Prisma Commands

Access the database through Prisma:

```bash
# Generate Prisma Client (after schema changes)
npm run db:generate

# Push schema changes to database (dev only)
npm run db:push

# Create and run migrations
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio
```

#### Database Connection

The database is accessible at:
- **From app container**: `db:5432`
- **From host machine**: `localhost:5432`

Default credentials (development only):
- User: `postgres`
- Password: `postgres`
- Database: `gc_react_db`

### Environment Variables

Development environment variables are configured in `.env.development`:

- `NODE_ENV`: Set to `development`
- `NEXT_PORT`: Port for the dev server (default: 3000)
- `DATABASE_URL`: PostgreSQL connection string

Example `.env.development`:
```env
NODE_ENV=development
NEXT_PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gc_react_db?schema=public
```

### Debugging

**View container logs:**
```bash
./dock logs
```

**Access container shell:**
```bash
./dock shell
```

**Check running processes:**
```bash
./dock shell
ps aux
```

**View resource usage:**
```bash
./dock status
```

**Debug database:**
```bash
# Open Prisma Studio
npm run db:studio

# Or connect with psql
docker exec -it gc-next-db psql -U postgres -d gc_react_db
```

### Rebuilding Containers

If you need to rebuild containers from scratch:

```bash
./dock rebuild
```

This will:
- Stop all containers
- Remove old images
- Rebuild without cache
- Prepare fresh containers

### Common Issues

**Port already in use:**
- Stop any containers using the port: `./dock stop`
- Or change the port in `.env.development`

**Database connection errors:**
- Ensure database container is running: `docker ps`
- Check DATABASE_URL in environment variables
- Verify database is ready: `docker logs gc-next-db`

**Changes not reflecting:**
- Ensure the container is running: `./dock status`
- Check that volumes are mounted correctly
- Try restarting: `./dock stop && ./dock dev`

**Container won't start:**
- Check Docker is running: `docker ps`
- View logs: `docker-compose logs`
- Rebuild: `./dock rebuild`

**Prisma errors:**
- Regenerate client: `npm run db:generate`
- Reset database: `docker-compose down -v` (warning: deletes data)
- Check schema syntax: Review `prisma/schema.prisma`

## Project Structure

```
app/
├── api/               # API route handlers
│   └── todos/        # Todo CRUD endpoints
│       ├── route.ts  # GET all, POST create
│       └── [id]/
│           └── route.ts  # GET, PUT, DELETE by id
├── todos/            # Todo page
│   └── page.tsx
├── layout.tsx        # Root layout
├── page.tsx          # Home page
└── globals.css       # Global styles

components/
├── HomePage.tsx      # Home page component
└── Navigation.tsx    # Navigation bar

lib/
└── prisma.ts         # Prisma client singleton

prisma/
└── schema.prisma     # Database schema
```

## Adding Dependencies

1. **Install in container:**
   ```bash
   ./dock shell
   npm install <package>
   ```

2. **Or install locally and rebuild:**
   ```bash
   npm install <package>
   ./dock rebuild
   ```

## Database Migrations

### Creating Migrations

1. **Update schema:**
   Edit `prisma/schema.prisma`

2. **Create migration:**
   ```bash
   npm run db:migrate
   ```

3. **Name your migration:**
   Provide a descriptive name when prompted

### Applying Migrations

Migrations are automatically applied when starting the dev container.

Manual application:
```bash
npx prisma migrate dev
```

### Resetting Database

To reset the database and apply all migrations:

```bash
docker-compose down -v  # Remove volumes
docker-compose up -d    # Recreate with fresh database
```

## Running Tests

See [Testing Guide](./testing.md) for detailed testing instructions.

Basic test commands:
```bash
npm run test:e2e          # Run all E2E tests
npm run test:e2e:ui       # Run in UI mode
npm run test:e2e:headed   # Run with visible browser
```

## API Development

### Testing API Endpoints

Using curl:
```bash
# Create a todo
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Test todo"}'

# Get all todos
curl http://localhost:3000/api/todos

# Update a todo
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated todo", "completed": true}'

# Delete a todo
curl -X DELETE http://localhost:3000/api/todos/1
```

### UI Testing

Visit http://localhost:3000/todos to test the full CRUD interface.
