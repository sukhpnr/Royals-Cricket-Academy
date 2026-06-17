# 🏏 Royals Cricket Academy

## Player Management System for Cricket Academy

A comprehensive, full-stack platform designed to manage players, training schedules, performance tracking, and academy operations for Royals Cricket Academy.

### 🎯 Features

- 👥 **Player Registration & Profile Management** - Complete player profiles with statistics
- 📅 **Training Schedule Management** - Organize and track training sessions
- 📊 **Performance Analytics** - Track player performance and improvements
- 🛠️ **Academy Administration Tools** - Manage academy operations efficiently
- 📈 **Player Statistics & Reports** - Generate detailed performance reports
- 🔐 **Secure Authentication** - User authentication and authorization
- 📱 **Responsive Design** - Works seamlessly on all devices

### 🏗️ Tech Stack

- **Frontend**: React/Next.js with TypeScript
- **Backend**: Express.js with Node.js
- **Database**: Drizzle ORM
- **Validation**: Zod for type-safe validation
- **Logging**: Pino for efficient logging
- **Language**: TypeScript for type safety

### 📦 Project Structure

```
Royals-Cricket-Academy/
├── artifacts/
│   ├── api-server/        # Express backend server
│   ├── web-client/        # Frontend application
│   ├── api-zod/           # API validation schemas
│   └── db/                # Database configuration
├── scripts/               # Utility scripts
└── package.json           # Root workspace configuration
```

### 🚀 Getting Started

#### Prerequisites
- Node.js (v18 or higher)
- pnpm package manager

#### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/sukhpnr/Royals-Cricket-Academy.git
cd Royals-Cricket-Academy
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Setup environment variables:**
Create a `.env.local` file in the root directory and add your configuration:
```
DATABASE_URL=your_database_url
API_PORT=5000
NODE_ENV=development
```

4. **Build the project:**
```bash
pnpm run build
```

5. **Run development server:**
```bash
pnpm run dev
```

### 📝 Available Scripts

- `pnpm run build` - Build all packages
- `pnpm run typecheck` - Type-check the entire project
- `pnpm run dev` - Start development server

### 🌐 Deployment

#### Vercel Deployment

1. Push your changes to GitHub
2. Connect repository to Vercel
3. Vercel will automatically detect the configuration
4. Deploy with one click!

**Environment Variables on Vercel:**
- Add your `DATABASE_URL` and other secrets in Vercel project settings

#### Manual Deployment

```bash
# Build for production
pnpm run build

# Start production server
pnpm run start
```

### 📚 Documentation

- [API Documentation](./artifacts/api-server/README.md)
- [Frontend Documentation](./artifacts/web-client/README.md)
- [Database Schema](./artifacts/db/README.md)

### 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 📋 Development Guidelines

- Use TypeScript for all new code
- Follow the existing code style
- Run `pnpm run typecheck` before committing
- Write meaningful commit messages

### 🐛 Bug Reports

Found a bug? Please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details

### 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

### 👨‍💼 Author

**Sukhpreet** - [GitHub Profile](https://github.com/sukhpnr)

### 📞 Support

For questions or support, please:
- Open an issue on GitHub
- Check existing documentation
- Review commit history for insights

---

**Last Updated:** June 2026
**Status:** 🟢 Active Development
