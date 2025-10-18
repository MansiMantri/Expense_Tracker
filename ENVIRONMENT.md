# Environment Configuration Guide

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

### MongoDB Connection
```env
MONGODB_URI=mongodb://localhost:27017/expense-tracker
```
- **Local MongoDB:** `mongodb://localhost:27017/expense-tracker`
- **MongoDB Atlas:** `mongodb+srv://username:password@cluster.mongodb.net/expense-tracker`

### JWT Secret
```env
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
```
- Generate a secure secret key (at least 32 characters)
- Use a random string generator for production
- Keep this secret and never commit it to version control

### Server Port
```env
PORT=5000
```
- Default port is 5000
- Change if needed for your environment

## Example .env File
```env
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=my_super_secret_jwt_key_that_is_very_long_and_random_123456789
PORT=5000
```

## Security Notes
- Never commit the `.env` file to version control
- Use different secrets for development and production
- Keep your MongoDB credentials secure
- Consider using environment-specific configurations

