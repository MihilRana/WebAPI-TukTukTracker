# WebAPI-TukTukTracker
Real-Time Three-Wheeler (Tuk-Tuk) Tracking & Movement Logging System for Sri Lanka Police.

**NIBM Student ID:** COBSCCOMP24.2P-070  
**Coventry Student ID:** 16115941

---

## Description
A RESTful API for tracking tuk-tuk locations across Sri Lanka. Built for law enforcement to monitor vehicle movements, manage driver records, and access historical location data.

## Tech Stack
- Node.js / Express.js
- MongoDB / Mongoose
- JWT Authentication
- Swagger API Documentation

## Features
- Role-based access control (5 user roles)
- Real-time vehicle location tracking
- Historical movement logs with time-window filtering
- Province and district-wise filtering
- Pagination, sorting, and search
- Conditional GET with ETag support
- Rate limiting and security headers
- Comprehensive API documentation via Swagger

## API Endpoints
- Authentication: /api/auth
- Provinces: /api/provinces
- Districts: /api/districts
- Police Stations: /api/stations
- Vehicles: /api/vehicles
- Drivers: /api/drivers
- Location Tracking: /api/locations
- API Documentation: /api-docs
- Health Check: /api/health

## Setup
1. Clone the repository
2. Run `npm install`
3. Create a `.env` file with:
   - MONGODB_URI=your_mongodb_connection_string
   - PORT=3000
   - JWT_SECRET=your_secret_key
   - JWT_EXPIRES_IN=24h
4. Seed the database: `npm run seed` then `npm run seed:locations`
5. Start the server: `npm start`

## Deployed API
URL: TBA

## API Documentation
Swagger: TBA