# Truth-Checker

# Truth Check Backend API

A robust backend API for fact-checking and Image Verification  using Google's Fact Check Tools API and user authentication system.

## Features

- User Authentication (Register/Login)
- Fact Check Claims using Google's Fact Check API
- Rate Limiting for API endpoints
- JWT-based Authentication
- MongoDB Database Integration
- Swagger API Documentation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Google Cloud Platform account with Fact Check Tools API enabled

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
GOOGLE_FACT_CHECK_API_KEY=your_google_api_key
MONGO_URI=your_mongodb_connection_string
PORT=3000
NODE_ENV=development
ACCESS_TOKEN_SECRET=your_jwt_secret
API_V1_STR=/api/v1
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/truthCheck.git
cd truthCheck
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
```

Request Body:
```json
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123!"
}
```

Password Requirements:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

Response:
```json
{
    "status": "success",
    "message": "user created successfully",
    "data": {}
}
```

#### Login User
```http
POST /api/v1/auth/login
```

Request Body:
```json
{
    "email": "test@example.com",
    "password": "Password123!"
}
```

Response:
```json
{
    "status": "success",
    "message": "user login successful",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIs...",
        "expiresIn": 3600
    }
}
```

### Fact Check Endpoints

#### Check Claim
```http
POST /api/v1/fact-check
```

Headers:
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

Request Body:
```json
{
    "claim": "The Earth is flat",
    "language": "en",
    "maxResults": 5
}
```

Response:
```json
{
    "claim": "The Earth is flat",
    "isVerified": false,
    "confidence": 0,
    "summary": {
        "rating": "False",
        "explanation": "Multiple reliable sources confirm this claim is false."
    },
    "sources": [
        {
            "url": "https://example.com/fact-check",
            "title": "Fact Check Title",
            "publisher": "Publisher Name",
            "date": "2024-03-20",
            "rating": "False"
        }
    ]
}
```

## Error Handling

The API uses standard HTTP status codes and returns error responses in the following format:

```json
{
    "status": "error",
    "message": "Error message",
    "errors": ["Detailed error messages"] // For validation errors
}
```

Common Error Codes:
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse:
- Fact Check endpoint: 10 requests per minute
- Authentication endpoints: 5 requests per minute

## Security

- JWT-based authentication
- Password hashing using bcrypt
- Helmet for security headers
- CORS enabled
- Rate limiting

## Development

### Project Structure

```
src/
├── configs/         # Configuration files
├── controllers/     # Route controllers
├── interfaces/      # TypeScript interfaces
├── middlewares/     # Custom middlewares
├── models/          # Mongoose models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build TypeScript files
- `npm start`: Start production server

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

For any questions or support, please contact [LEARNABLE-24'-TEAM-10] at [LEARNABLE-24'-TEAM-10@GMAIL.COM]
