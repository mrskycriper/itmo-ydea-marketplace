import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { TopicModule } from './topic/topic.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './all.exception.filter';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule.forRoot({
      connectionURI: process.env.CONNECTION_URI,
      apiKey: process.env.API_KEY,
      appInfo: {
        appName: 'OpenForum',
        apiDomain: process.env.API_DOMAIN,
        websiteDomain: process.env.WEBSITE_DOMAIN,
      },
    }),
    UserModule,
    ChatModule,
    PostModule,
    TopicModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
