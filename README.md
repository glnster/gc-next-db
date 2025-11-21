# GC React Scaffold

A production-ready Docker-based scaffold for React + Tailwind CSS applications with comprehensive development and production environments.

## Features

- 🐳 **Docker-based**: Separate containers for development and production
- ⚡ **Fast Development**: Vite with hot module replacement
- 🎨 **Tailwind CSS**: Utility-first CSS framework
- 📘 **TypeScript**: Type-safe development
- 🧪 **Playwright**: End-to-end testing
- 📚 **Storybook**: Component development and documentation
- 🔒 **SSL/HTTPS**: Production-ready SSL support with nginx
- 🛠️ **Helper Scripts**: Convenient `dock` command for common tasks

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gc-react
   ```

2. **Start development environment**
   ```bash
   ./dock dev
   ```

3. **Open your browser**
   - Navigate to `http://localhost:5173`

That's it! The development environment is running with hot module replacement.

## Available Commands

The `dock` helper script provides convenient commands:

### Development

```bash
./dock dev              # Start development container with live reload
./dock detached         # Start dev container in background
./dock stop             # Stop all containers
./dock logs             # View container logs
./dock shell            # Open shell in running container
./dock status           # Show container status and resource usage
```

### Production

```bash
./dock prod             # Build and start production container
```

### Maintenance

```bash
./dock rebuild          # Force rebuild all containers
./dock prune            # Remove stopped containers and unused images
```

### Help

```bash
./dock help             # Show all available commands
```

## Project Structure

```
gc-react/
├── .storybook/         # Storybook configuration
├── docs/               # Documentation
│   ├── architecture.md
│   ├── development.md
│   ├── deployment.md
│   └── testing.md
├── public/             # Static assets
├── src/                # Source code
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── stories/            # Storybook stories
├── tests/              # Test files
│   └── e2e/           # End-to-end tests
├── docker-compose.yml  # Development configuration
├── docker-compose.prod.yml  # Production configuration
├── Dockerfile          # Development container
├── Dockerfile.prod     # Production container
├── dock                # Helper script
└── nginx.conf          # Production nginx configuration
```

## Development

### Running the Development Server

```bash
./dock dev
```

The development server runs on `http://localhost:5173` with:
- Hot module replacement
- Fast refresh
- Source maps for debugging

### Running Tests

```bash
npm run test:e2e        # Run all E2E tests
npm run test:e2e:ui     # Run tests in UI mode
npm run test:e2e:headed # Run tests with browser visible
```

### Storybook

```bash
npm run storybook       # Start Storybook
```

Access Storybook at `http://localhost:6006`

## Production Deployment

### SSL/HTTPS Setup

1. **Obtain SSL certificates** (Let's Encrypt, custom CA, etc.)

2. **Place certificates:**
   ```bash
   mkdir -p ssl
   cp your-cert.pem ssl/cert.pem
   cp your-key.pem ssl/key.pem
   ```

3. **Start production container:**
   ```bash
   ./dock prod
   ```

The production container:
- Serves on ports 80 (HTTP) and 443 (HTTPS)
- Automatically redirects HTTP to HTTPS
- Includes security headers
- Optimized for performance

See [Deployment Guide](./docs/deployment.md) for detailed instructions.

## Environment Variables

### Development

Configure in `.env.development`:

```env
NODE_ENV=development
VITE_PORT=5173
VITE_API_URL=http://localhost:3000
```

### Production

Configure in `.env.production`:

```env
NODE_ENV=production
HTTP_PORT=80
HTTPS_PORT=443
SSL_ENABLED=true
SSL_CERT_PATH=/etc/nginx/ssl/cert.pem
SSL_KEY_PATH=/etc/nginx/ssl/key.pem
VITE_API_URL=https://api.example.com
```

## Documentation

- [Architecture](./docs/architecture.md) - System architecture and design
- [Development Guide](./docs/development.md) - Development workflow and tips
- [Deployment Guide](./docs/deployment.md) - Production deployment instructions
- [Testing Guide](./docs/testing.md) - Testing with Playwright

## Tech Stack

- **Runtime**: Node.js 20 LTS
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Language**: TypeScript 5
- **Testing**: Playwright
- **Component Development**: Storybook 7
- **Production Server**: nginx (alpine)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test:e2e` - Run E2E tests
- `npm run storybook` - Start Storybook
- `npm run build-storybook` - Build Storybook

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

[Add your license here]

## Support

For issues and questions, please open an issue on GitHub.

