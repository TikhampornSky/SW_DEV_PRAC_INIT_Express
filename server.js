const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors')
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
});

// Route files
const hospitals = require('./routes/hospitals')
const auth = require('./routes/auth')
const appointments = require('./routes/appointments')

// Load env vars
dotenv.config({path: './config/config.env'});
// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

app.use(mongoSanitize());   // Data sanitization against NoSQL query injection
app.use(helmet());      // Set security headers
app.use(xss());         // Prevent XSS attacks
app.use(limiter);       // Rate limiting
app.use(hpp());         // Prevent http param pollution
app.use(cors()) // Use this after the variable declaration

// Mount routers
app.use('/api/v1/hospitals', hospitals)
app.use('/api/v1/auth', auth)
app.use('/api/v1/appointments', appointments)

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log("Server running in ", process.env.NODE_ENV, " mode on port ", PORT);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);

    // Close server & exit process
    server.close(() => process.exit(1));
});

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Library API',
            version: '1.0.0',
            description: 'A simple Express VacQ API',
        },
        servers: [
            {
                url: 'http://localhost:5000/api/v1',
            },
        ],
    },
    apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));