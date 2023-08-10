import winston, { format } from 'winston';
import config from '@config';

const { combine, timestamp, printf, colorize, errors } = format;

const customFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

const logger = winston.createLogger({
    level: config.LOG_LEVEL,
    format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        customFormat
    ),
    transports: [
        new winston.transports.Console({
            handleExceptions: true,
        }),
    ],
    exitOnError: false, // Don't force the app to exit on unhandled exceptions
});

export default logger;
