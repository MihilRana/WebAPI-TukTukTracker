require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');
const conditionalGet = require('./src/middleware/conditionalGet');
const securityHeaders = require('./src/middleware/securityHeaders');
const { generalLimiter, authLimiter, pingLimiter } = require('./src/middleware/rateLimiter');
const authRoutes = require('./src/routes/authRoutes');
const provinceRoutes = require('./src/routes/provinceRoutes');
const districtRoutes = require('./src/routes/districtRoutes');
const policeStationRoutes = require('./src/routes/policeStationRoutes');
const vehicleRoutes = require('./src/routes/vehicleRoutes');
const driverRoutes = require('./src/routes/driverRoutes');
const locationRoutes = require('./src/routes/locationRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(securityHeaders);
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(generalLimiter);
app.use(conditionalGet);

connectDB();

app.get('/', (req, res) => {
  res.json({ message: 'TukTuk Tracker API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/provinces', provinceRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/stations', policeStationRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: 'TukTuk Tracker API Documentation'
}));

app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});