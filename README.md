# Trading Competition API

A comprehensive RESTful API for managing trading competitions built with Express.js, Sequelize, and PostgreSQL.

## Features

- 🔐 **User Authentication**: JWT-based authentication with registration and login
- 👤 **User Management**: Profile management with validation
- 🛡️ **Security**: Input validation, rate limiting, password hashing
- 📊 **API Documentation**: Comprehensive API documentation
- 🚀 **Express.js**: Fast and minimal web framework
- 🗃️ **PostgreSQL**: Robust database with Sequelize ORM

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and navigate to the project**

   ```bash
   cd amri
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your database credentials and JWT secret.

4. **Set up the database**

   ```bash
   # Create the database
   createdb trading_competition_dev

   # Run migrations (if you have them)
   # npx sequelize-cli db:migrate
   ```

5. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "username": "johndoe",
  "fullName": "John Doe"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

### User Profile

#### Get Profile (Protected)

```http
GET /api/users/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Update Profile (Protected)

```http
PUT /api/users/profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "username": "newusername",
  "fullName": "New Full Name"
}
```

## Testing the API

### Health Check

```bash
curl http://localhost:3000/health
```

### Register a New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "username": "testuser",
    "fullName": "Test User"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

## Environment Variables

| Variable         | Description       | Default                   |
| ---------------- | ----------------- | ------------------------- |
| `PORT`           | Server port       | `3000`                    |
| `NODE_ENV`       | Environment       | `development`             |
| `DB_HOST`        | Database host     | `localhost`               |
| `DB_PORT`        | Database port     | `5432`                    |
| `DB_NAME`        | Database name     | `trading_competition_dev` |
| `DB_USERNAME`    | Database username | `postgres`                |
| `DB_PASSWORD`    | Database password | `password`                |
| `JWT_SECRET`     | JWT secret key    | (required)                |
| `JWT_EXPIRES_IN` | JWT expiration    | `24h`                     |

## Project Structure

```
amri/
├── app.js                 # Express application entry point
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── README.md             # This file
├── config/
│   └── config.json       # Database configuration
├── controllers/
│   └── UserController.js # User-related controllers
├── helpers/
│   ├── bcrypt.js         # Password hashing utilities
│   └── jwt.js            # JWT utilities
├── middleware/
│   ├── auth.js           # Authentication middleware
│   └── validation.js     # Input validation middleware
├── models/
│   ├── index.js          # Sequelize models index
│   └── user.js           # User model
└── routes/
    ├── auth.js           # Authentication routes
    └── users.js          # User routes
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Express-validator for request validation
- **Rate Limiting**: Protect against brute force attacks
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers middleware

## Error Handling

The API uses standardized error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

## Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

## Development

### Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run tests (when implemented)

### Adding New Features

1. Create models in `/models`
2. Add controllers in `/controllers`
3. Define routes in `/routes`
4. Add middleware in `/middleware` if needed
5. Update API documentation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

**Author**: Amri  
**Version**: 1.0.0
