import { Prisma } from '@prisma/client';

export type PrismaError  = Prisma.PrismaClientKnownRequestError |
      Prisma.PrismaClientUnknownRequestError |
      Prisma.PrismaClientValidationError |
      Prisma.PrismaClientInitializationError |
      Prisma.PrismaClientRustPanicError & {safeDetails: string}


// Error types that can be safely exposed to clients
export interface SafeError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: string;
  requestId?: string;
}

// Internal error structure for logging
interface InternalError {
  code: string;
  message: string;
  details: unknown;
  stack?: string;
  originalError: unknown;
}

// Configuration for error handling
interface ErrorHandlerConfig {
  environment: 'development' | 'production' | 'test';
  includeRequestId?: boolean;
  logErrors?: boolean;
}

type TParsedError = {
  code: string;
  message: string;
  statusCode: number;
  clientCode?: string;
  clientMessage?: string;
  details: unknown;
  safeDetails?: unknown;
}

class DBErrorHandler {
  private config: ErrorHandlerConfig;

  constructor(config: ErrorHandlerConfig) {
    this.config = {
      includeRequestId: true,
      logErrors: true,
      ...config,
    };
  }

  /**
   * Main function to handle Prisma errors and return safe API responses
   */
  public handleError(error: PrismaError, requestId?: string): {
    safeError: SafeError;
    statusCode: number;
    internalError?: InternalError;
  } {
    // Parse the error
    const parsedError = this.parsePrismaError(error);
    
    // Create internal error for logging
    const internalError: InternalError = {
      code: parsedError.code,
      message: parsedError.message,
      details: parsedError.details,
      stack: this.config.environment === 'development' ? error.stack : undefined,
      originalError: error,
    };

    // Log error if configured
    if (this.config.logErrors) {
      this.logError(internalError);
    }

    // Create safe error for client
    const safeError: SafeError = {
      code: parsedError.clientCode || parsedError.code,
      message: parsedError.clientMessage || parsedError.message,
      timestamp: new Date().toISOString(),
    };

    // Add request ID if configured
    if (this.config.includeRequestId && requestId) {
      safeError.requestId = requestId;
    }

    // Add limited details in development
    if (this.config.environment === 'development' && parsedError.safeDetails) {
      safeError.details = parsedError.safeDetails;
    }

    return {
      safeError,
      statusCode: parsedError.statusCode,
      internalError: this.config.environment === 'development' ? internalError : undefined,
    };
  }

  /**
   * Parse Prisma errors and categorize them
   */
  private parsePrismaError(error: PrismaError): TParsedError{
    // Default error
    
    let result:TParsedError  = {
      code: 'INTERNAL_ERROR',
      message: 'An internal server error occurred',
      statusCode: 500,
      clientMessage: 'Something went wrong. Please try again later.',
      details: error,
    };

    // Prisma Known Errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handleKnownRequestError(error);
    }

    // Prisma Unknown Errors
    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      result = {
        code: 'DATABASE_UNKNOWN_ERROR',
        message: 'An unknown database error occurred',
        statusCode: 500,
        clientMessage: 'Database service temporarily unavailable.',
        details: error,
      };
    }

    // Prisma Validation Errors
    if (error instanceof Prisma.PrismaClientValidationError) {
      result = {
        code: 'VALIDATION_ERROR',
        message: 'Database validation failed',
        statusCode: 400,
        clientMessage: 'Invalid data provided.',
        details: error,
        safeDetails: this.config.environment === 'development' ? error.message : undefined,
      };
    }

    // Prisma Initialization Errors
    if (error instanceof Prisma.PrismaClientInitializationError) {
      result = {
        code: 'DATABASE_CONNECTION_ERROR',
        message: 'Failed to connect to database',
        statusCode: 503,
        clientMessage: 'Service temporarily unavailable.',
        details: error,
      };
    }

    // Prisma RUST Panics
    if (error instanceof Prisma.PrismaClientRustPanicError) {
      result = {
        code: 'DATABASE_PANIC',
        message: 'Database engine encountered a fatal error',
        statusCode: 500,
        clientMessage: 'Service temporarily unavailable.',
        details: error,
      };
    }

    return result;
  }

  /**
   * Handle Prisma known request errors
   */
  private handleKnownRequestError(error: Prisma.PrismaClientKnownRequestError) {
    const baseError = {
      code: error.code,
      message: error.message,
      statusCode: 500, // default
      details: error,
    };

    // Map Prisma error codes to HTTP status codes and client messages
    const errorMappings: { [key: string]: { statusCode: number; clientMessage: string } } = {
      // Unique constraint violation
      P2002: { statusCode: 409, clientMessage: 'Resource already exists' },
      
      // Foreign key constraint violation
      P2003: { statusCode: 409, clientMessage: 'Referenced resource not found' },
      
      // Constraint violation
      P2004: { statusCode: 409, clientMessage: 'Database constraint violation' },
      
      // Record not found
      P2025: { statusCode: 404, clientMessage: 'Resource not found' },
      
      // Query interpretation error
      P2016: { statusCode: 400, clientMessage: 'Invalid query parameters' },
      
      // Required value missing
      P2012: { statusCode: 400, clientMessage: 'Required fields missing' },
      
      // Invalid field type
      P2006: { statusCode: 400, clientMessage: 'Invalid data type provided' },
    };

    const mapping = errorMappings[error.code];
    if (mapping) {
      return {
        ...baseError,
        statusCode: mapping.statusCode,
        clientMessage: mapping.clientMessage,
        safeDetails: this.config.environment === 'development' ? {
          meta: error.meta,
        } : undefined,
      };
    }

    return baseError;
  }

  /**
   * Log errors appropriately based on environment
   */
  private logError(internalError: InternalError): void {
    if (this.config.environment === 'production') {
      // Structured logging for production
      console.error(JSON.stringify({
        level: 'ERROR',
        timestamp: new Date().toISOString(),
        code: internalError.code,
        message: internalError.message,
        details: internalError.details,
      }));
    } else {
      // Detailed logging for development
      console.error('Database Error:', {
        code: internalError.code,
        message: internalError.message,
        details: internalError.details,
        stack: internalError.stack,
      });
    }
  }

  /**
   * Utility to check if error is a database error
   */
  public isDatabaseError(error: Error): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientUnknownRequestError ||
      error instanceof Prisma.PrismaClientValidationError ||
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientRustPanicError
    );
  }
}

// Singleton instance with default configuration
let defaultErrorHandler: DBErrorHandler;

/**
 * Initialize the error handler
 */
export function initializeErrorHandler(config: ErrorHandlerConfig): void {
  defaultErrorHandler = new DBErrorHandler(config);
}

/**
 * Main dbutilerror function - convenience wrapper
 */
export function dbErrorFormatter(
  error: PrismaError, 
  requestId?: string
): { 
  safeError: SafeError; 
  statusCode: number; 
  internalError?: InternalError;
} {
  if (!defaultErrorHandler) {
    // Initialize with defaults if not initialized
    defaultErrorHandler = new DBErrorHandler({
      environment: process.env.NODE_ENV as 'development' | 'production' || 'development',
    });
  }

  return defaultErrorHandler.handleError(error, requestId);
}

/**
 * Utility to create consistent API error responses
 */
export function createDbErrorResponse(
  error: PrismaError, 
  requestId?: string
): { status: number; data: { error: SafeError } } {
  const { safeError, statusCode } = dbErrorFormatter(error, requestId);
  
  return {
    status: statusCode,
    data: { error: safeError },
  };
}


 // Handle unique constraint violations
    // if (error.code === 'P2002') {
    //   result = {
    //     code: 'UNIQUE_CONSTRAINT_VIOLATION',
    //     message: 'Unique constraint violation',
    //     statusCode: 409,
    //     clientMessage: 'Resource already exists with the provided data.',
    //     details: error,
    //     safeDetails: this.config.environment === 'development' ? {
    //       field: error.meta?.target,
    //     } : undefined,
    //   };
    // }

    // // Handle foreign key constraint violations
    // if (error.code === 'P2003') {
    //   result = {
    //     code: 'FOREIGN_KEY_CONSTRAINT_VIOLATION',
    //     message: 'Foreign key constraint violation',
    //     statusCode: 409,
    //     clientMessage: 'Referenced resource does not exist.',
    //     details: error,
    //   };
    // }

    // // Handle not found errors
    // if (error.code === 'P2025') {
    //   result = {
    //     code: 'RECORD_NOT_FOUND',
    //     message: 'Record not found',
    //     statusCode: 404,
    //     clientMessage: 'The requested resource was not found.',
    //     details: error,
    //   };
    // }