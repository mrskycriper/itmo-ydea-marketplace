import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse();
    console.log(exception);

    if (exception instanceof HttpException) {
      return response.render('error', exception);
    } else {
      return response.render('error', {
        response: {
          statusCode: '500',
          error: 'Internal server error',
          message: exception,
        },
      });
    }
  }
}
