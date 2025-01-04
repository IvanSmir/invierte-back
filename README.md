# Invierte API

## Description

Invierte API is a robust backend service built with NestJS, designed to manage property listings, reservations, and user authentication. This API provides a comprehensive solution for real estate management systems, offering features such as property creation, image and document uploads, lot management, and user reservations.

## Key Features

- **User Authentication**: Secure JWT-based authentication system.
- **Property Management**: Create, read, update, and delete property listings.
- **Lot Management**: Handle individual lots within properties.
- **File Upload**: Support for uploading property images and documents.
- **Reservations**: Allow users to make reservations for specific lots.
- **Role-based Access Control**: Implement user roles and permissions.

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Passport.js with JWT strategy
- **File Storage**: Supabase
- **API Documentation**: Swagger

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/IvanSmir/invierte-back.git
   cd invierte-back
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required environment variables

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run start:dev
   ```

## API Documentation

Once the server is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api
```

## Main Endpoints

- `/auth`: User authentication and registration
- `/property`: Property management
- `/reservation`: Reservation handling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

