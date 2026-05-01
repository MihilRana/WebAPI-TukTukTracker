const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TukTuk Tracker API',
            version: '1.0.0',
            description: 'Real-Time Three-Wheeler Tracking & Movement Logging System for Sri Lanka Police. This API provides endpoints for vehicle registration, driver management, GPS location tracking, and administrative boundary management.',
            contact: {
                name: 'API Support'
            }
        },
        servers: [
            {
                url: 'https://webapi-tuktuktracker.onrender.com',
                description: 'Production server'
            },
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token obtained from /api/auth/login'
                }
            },
            schemas: {
                Province: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                        name: { type: 'string', example: 'Western' },
                        code: { type: 'string', example: 'WP' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                District: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '507f1f77bcf86cd799439012' },
                        name: { type: 'string', example: 'Colombo' },
                        code: { type: 'string', example: 'CMB' },
                        province: { $ref: '#/components/schemas/Province' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                PoliceStation: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '507f1f77bcf86cd799439013' },
                        name: { type: 'string', example: 'Colombo Fort Police Station' },
                        district: { $ref: '#/components/schemas/District' },
                        contactNumber: { type: 'string', example: '011-2421111' },
                        address: { type: 'string', example: 'Fort, Colombo 01' }
                    }
                },
                Driver: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '507f1f77bcf86cd799439014' },
                        firstName: { type: 'string', example: 'Kamal' },
                        lastName: { type: 'string', example: 'Perera' },
                        nicNumber: { type: 'string', example: '1990123456V' },
                        licenseNumber: { type: 'string', example: 'B1234567' },
                        phone: { type: 'string', example: '0771234567' },
                        district: { $ref: '#/components/schemas/District' },
                        status: { type: 'string', enum: ['active', 'inactive', 'suspended'] }
                    }
                },
                Vehicle: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '507f1f77bcf86cd799439015' },
                        registrationNumber: { type: 'string', example: 'WP-AB-1234' },
                        driver: { $ref: '#/components/schemas/Driver' },
                        district: { $ref: '#/components/schemas/District' },
                        make: { type: 'string', example: 'Bajaj' },
                        model: { type: 'string', example: 'RE Compact' },
                        year: { type: 'number', example: 2022 },
                        color: { type: 'string', example: 'Red' },
                        status: { type: 'string', enum: ['active', 'inactive', 'deregistered'] }
                    }
                },
                LocationPing: {
                    type: 'object',
                    properties: {
                        vehicleId: { type: 'string', example: '507f1f77bcf86cd799439015' },
                        latitude: { type: 'number', example: 6.9271 },
                        longitude: { type: 'number', example: 79.8612 },
                        speed: { type: 'number', example: 25.5 },
                        heading: { type: 'number', example: 180 }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        username: { type: 'string', example: 'admin' },
                        role: {
                            type: 'string',
                            enum: ['superadmin', 'provincial_admin', 'district_officer', 'station_officer', 'operator']
                        },
                        isActive: { type: 'boolean', example: true }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Something went wrong' }
                    }
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
