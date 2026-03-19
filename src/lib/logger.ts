/**
 * Production-Grade Structured Logger
 * 
 * Provides consistent logging across the application.
 * - Development: Pretty-printed logs for readability.
 * - Production: Structured JSON for log aggregators (Vercel, Datadog, etc.).
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private isProduction = process.env.NODE_ENV === 'production';

  private log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    
    if (this.isProduction) {
      // Structured JSON for production
      const logEntry = {
        timestamp,
        level,
        message,
        ...data,
      };
      
      if (level === 'error') {
        console.error(JSON.stringify(logEntry));
      } else {
        console.log(JSON.stringify(logEntry));
      }
    } else {
      // Friendly pretty-printing for development
      const colors = {
        info: '\x1b[36m', // Cyan
        warn: '\x1b[33m', // Yellow
        error: '\x1b[31m', // Red
        debug: '\x1b[90m', // Gray
        reset: '\x1b[0m',
      };

      const color = colors[level] || colors.reset;
      const dataStr = data ? `\n${JSON.stringify(data, null, 2)}` : '';
      
      console.log(`${color}[${level.toUpperCase()}]${colors.reset} ${message}${dataStr}`);
    }
  }

  info(message: string, data?: any) { this.log('info', message, data); }
  warn(message: string, data?: any) { this.log('warn', message, data); }
  error(message: string, data?: any) { this.log('error', message, data); }
  debug(message: string, data?: any) { this.log('debug', message, data); }
}

export const logger = new Logger();
