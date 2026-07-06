export class NullVoidError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = 'NullVoidError';
  }
}

export class ValidationError extends NullVoidError {
  constructor(message: string, public readonly fields?: Record<string, string[]>) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends NullVoidError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends NullVoidError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends NullVoidError {
  constructor(message = 'Forbidden') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenError';
  }
}

export class RateLimitError extends NullVoidError {
  constructor() {
    super('Rate limit exceeded', 'RATE_LIMIT', 429);
    this.name = 'RateLimitError';
  }
}

export class ConflictError extends NullVoidError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
    this.name = 'ConflictError';
  }
}

export class DatabaseError extends NullVoidError {
  constructor(message: string, public readonly cause?: unknown) {
    super(message, 'DATABASE_ERROR', 500);
    this.name = 'DatabaseError';
  }
}

export class DiscordAPIError extends NullVoidError {
  constructor(message: string) {
    super(message, 'DISCORD_API_ERROR', 502);
    this.name = 'DiscordAPIError';
  }
}
