import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let code = 500;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        code = (exceptionResponse as any).code || status;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`${request.method} ${request.url} - ${exception.stack}`);
    }

    const errorResponse = {
      code: status >= 400 && status < 500 ? status : 500,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    if (status >= 500) {
      this.logger.error(`${request.method} ${request.url} - ${JSON.stringify(errorResponse)}`);
    } else {
      this.logger.warn(`${request.method} ${request.url} - ${message}`);
    }

    response.status(status).json(errorResponse);
  }
}
