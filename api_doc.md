# Trading Competition API Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Database Design](#database-design)
3. [Authentication & Authorization](#authentication--authorization)
4. [API Endpoints](#api-endpoints)
5. [Error Handling](#error-handling)
6. [Response Format](#response-format)
7. [Websocket Events](#websocket-events)

## Architecture Overview

### System Architecture
The Trading Competition API follows a RESTful architecture with the following components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Database      │
│   (React/Vue)   │◄──►│   (Express.js)  │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   WebSocket     │
                       │   (Socket.io)   │
                       └─────────────────┘
```

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Real-time Communication**: Socket.io
- **Environment**: dotenv for configuration

### Core Features
- User Registration & Authentication
- Trading Competition Management
- Portfolio Tracking
- Real-time Leaderboard
- Trade Execution & Validation
- Historical Performance Analysis

## Database Design

### Entity Relationship Diagram

```
Users (1) ──── (M) Competitions ──── (M) Participants
  │                                      │
  │                                      │
  └─── (1:M) ──── Portfolios ──── (1:M) ──┘
                      │
                      │
                  (1:M) Trades
                      │
                  (M:1) Stocks
```

### Database Schema

#### Users Table
| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL |
| username | VARCHAR(100) | UNIQUE, NOT NULL |
| fullName | VARCHAR(255) | NOT NULL |
| profileImage | TEXT | NULL |
| isActive | BOOLEAN | DEFAULT true |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | DEFAULT NOW() |

#### Competitions Table
| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(255) | NOT NULL |
| description | TEXT | NOT NULL |
| startDate | TIMESTAMP | NOT NULL |
| endDate | TIMESTAMP | NOT NULL |
| initialBalance | DECIMAL(15,2) | DEFAULT 100000.00 |
| status | ENUM('upcoming', 'active', 'completed') | DEFAULT 'upcoming' |
| maxParticipants | INTEGER | DEFAULT 100 |
| prizePool | DECIMAL(15,2) | NULL |
| createdBy | INTEGER | FOREIGN KEY → Users(id) |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | DEFAULT NOW() |

#### Participants Table
| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| userId | INTEGER | FOREIGN KEY → Users(id) |
| competitionId | INTEGER | FOREIGN KEY → Competitions(id) |
| currentBalance | DECIMAL(15,2) | DEFAULT 100000.00 |
| totalReturn | DECIMAL(10,4) | DEFAULT 0.0000 |
| rank | INTEGER | NULL |
| joinedAt | TIMESTAMP | DEFAULT NOW() |

#### Portfolios Table
| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| participantId | INTEGER | FOREIGN KEY → Participants(id) |
| stockSymbol | VARCHAR(10) | NOT NULL |
| quantity | INTEGER | NOT NULL |
| avgBuyPrice | DECIMAL(10,2) | NOT NULL |
| currentPrice | DECIMAL(10,2) | NOT NULL |
| unrealizedPnL | DECIMAL(15,2) | DEFAULT 0.00 |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | DEFAULT NOW() |

#### Trades Table
| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| participantId | INTEGER | FOREIGN KEY → Participants(id) |
| stockSymbol | VARCHAR(10) | NOT NULL |
| tradeType | ENUM('BUY', 'SELL') | NOT NULL |
| quantity | INTEGER | NOT NULL |
| price | DECIMAL(10,2) | NOT NULL |
| totalAmount | DECIMAL(15,2) | NOT NULL |
| fee | DECIMAL(10,2) | DEFAULT 0.00 |
| status | ENUM('pending', 'executed', 'cancelled') | DEFAULT 'pending' |
| executedAt | TIMESTAMP | NULL |
| createdAt | TIMESTAMP | DEFAULT NOW() |

#### Stocks Table
| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| symbol | VARCHAR(10) | UNIQUE, NOT NULL |
| name | VARCHAR(255) | NOT NULL |
| sector | VARCHAR(100) | NULL |
| currentPrice | DECIMAL(10,2) | NOT NULL |
| previousClose | DECIMAL(10,2) | NOT NULL |
| changePercent | DECIMAL(8,4) | DEFAULT 0.0000 |
| volume | BIGINT | DEFAULT 0 |
| marketCap | BIGINT | NULL |
| lastUpdated | TIMESTAMP | DEFAULT NOW() |

## Authentication & Authorization

### JWT Token Structure
```json
{
  "id": 1,
  "email": "user@example.com",
  "iat": 1640995200,
  "exp": 1640998800
}
```

### Authentication Flow
1. User registers with email/password
2. Password is hashed using bcrypt
3. User logs in with credentials
4. Server validates credentials and returns JWT token
5. Client includes token in Authorization header for protected routes
6. Server validates token on each protected request

### Protected Routes
All routes except `/auth/register` and `/auth/login` require authentication.

## API Endpoints

### Base URL
```
https://api.tradingcompetition.com/v1
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "johndoe",
  "fullName": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "fullName": "John Doe"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "johndoe"
    }
  }
}
```

### Competition Endpoints

#### Get All Competitions
```http
GET /competitions
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Q1 2025 Trading Challenge",
      "description": "Quarterly trading competition with $10,000 prize pool",
      "startDate": "2025-01-01T00:00:00Z",
      "endDate": "2025-03-31T23:59:59Z",
      "status": "active",
      "participantCount": 45,
      "maxParticipants": 100,
      "prizePool": 10000.00
    }
  ]
}
```

#### Get Competition Details
```http
GET /competitions/:id
Authorization: Bearer {token}
```

#### Create Competition
```http
POST /competitions
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Summer Trading Challenge",
  "description": "3-month summer trading competition",
  "startDate": "2025-06-01T00:00:00Z",
  "endDate": "2025-08-31T23:59:59Z",
  "initialBalance": 100000.00,
  "maxParticipants": 200,
  "prizePool": 15000.00
}
```

#### Join Competition
```http
POST /competitions/:id/join
Authorization: Bearer {token}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Successfully joined competition",
  "data": {
    "participantId": 123,
    "competitionId": 1,
    "currentBalance": 100000.00,
    "joinedAt": "2025-06-03T10:30:00Z"
  }
}
```

### Trading Endpoints

#### Get Portfolio
```http
GET /competitions/:competitionId/portfolio
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "participantId": 123,
    "currentBalance": 95000.00,
    "totalPortfolioValue": 105000.00,
    "totalReturn": 5.00,
    "rank": 15,
    "positions": [
      {
        "stockSymbol": "AAPL",
        "quantity": 50,
        "avgBuyPrice": 150.00,
        "currentPrice": 155.00,
        "unrealizedPnL": 250.00,
        "percentChange": 3.33
      }
    ]
  }
}
```

#### Execute Trade
```http
POST /competitions/:competitionId/trades
Authorization: Bearer {token}
Content-Type: application/json

{
  "stockSymbol": "AAPL",
  "tradeType": "BUY",
  "quantity": 10,
  "price": 150.00
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Trade executed successfully",
  "data": {
    "tradeId": 456,
    "stockSymbol": "AAPL",
    "tradeType": "BUY",
    "quantity": 10,
    "price": 150.00,
    "totalAmount": 1500.00,
    "fee": 5.00,
    "executedAt": "2025-06-03T10:45:00Z"
  }
}
```

#### Get Trade History
```http
GET /competitions/:competitionId/trades
Authorization: Bearer {token}
Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- type: 'BUY' | 'SELL' (optional)
```

### Leaderboard Endpoints

#### Get Competition Leaderboard
```http
GET /competitions/:competitionId/leaderboard
Authorization: Bearer {token}
Query Parameters:
- page: number (default: 1)
- limit: number (default: 50)
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "username": "tradingpro",
        "totalReturn": 25.50,
        "portfolioValue": 125500.00,
        "totalTrades": 45
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalParticipants": 150
    }
  }
}
```

### Stock Data Endpoints

#### Get Stock Quote
```http
GET /stocks/:symbol
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "currentPrice": 155.00,
    "previousClose": 150.00,
    "changePercent": 3.33,
    "volume": 5000000,
    "marketCap": 2500000000000,
    "lastUpdated": "2025-06-03T16:00:00Z"
  }
}
```

#### Search Stocks
```http
GET /stocks/search
Authorization: Bearer {token}
Query Parameters:
- query: string (search term)
- limit: number (default: 10)
```

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": {}
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

### Common Error Codes
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_FAILED` - Invalid credentials
- `INSUFFICIENT_FUNDS` - Not enough balance for trade
- `MARKET_CLOSED` - Trading outside market hours
- `COMPETITION_NOT_ACTIVE` - Competition is not in active state
- `TRADE_LIMIT_EXCEEDED` - Daily trade limit reached

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "meta": {
    "timestamp": "2025-06-03T10:30:00Z",
    "version": "1.0.0"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  },
  "meta": {
    "timestamp": "2025-06-03T10:30:00Z",
    "version": "1.0.0"
  }
}
```

## WebSocket Events

### Real-time Features
- Live portfolio updates
- Leaderboard changes
- Stock price updates
- Trade notifications

### Socket Events

#### Client → Server Events

##### Join Competition Room
```javascript
socket.emit('join-competition', {
  competitionId: 1,
  token: 'jwt-token'
});
```

##### Subscribe to Stock Updates
```javascript
socket.emit('subscribe-stocks', {
  symbols: ['AAPL', 'GOOGL', 'MSFT']
});
```

#### Server → Client Events

##### Portfolio Update
```javascript
socket.on('portfolio-update', (data) => {
  // data contains updated portfolio information
  console.log('Portfolio updated:', data);
});
```

##### Stock Price Update
```javascript
socket.on('stock-price-update', (data) => {
  // data contains real-time stock prices
  console.log('Price update:', data);
});
```

##### Leaderboard Update
```javascript
socket.on('leaderboard-update', (data) => {
  // data contains updated leaderboard positions
  console.log('Leaderboard changed:', data);
});
```

##### Trade Executed
```javascript
socket.on('trade-executed', (data) => {
  // data contains trade execution details
  console.log('Trade executed:', data);
});
```

## Rate Limiting

### API Rate Limits
- Authentication endpoints: 5 requests per minute
- Trading endpoints: 100 requests per minute
- Data endpoints: 1000 requests per minute
- WebSocket connections: 10 connections per user

### Implementation
Rate limiting is implemented using express-rate-limit middleware with Redis for distributed rate limiting.

## Security Considerations

### Input Validation
- All inputs are validated using Joi schemas
- SQL injection prevention through Sequelize ORM
- XSS protection with input sanitization

### Authentication Security
- JWT tokens expire after 24 hours
- Refresh token mechanism for seamless re-authentication
- Password requirements: minimum 8 characters, mixed case, numbers

### Trading Security
- Trade validation against current market prices
- Balance verification before trade execution
- Audit trail for all trading activities
- Market hours validation

---

*Last updated: June 3, 2025*
*API Version: 1.0.0*