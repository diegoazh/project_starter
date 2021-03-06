import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: `./environments/.env.${
        process.env.NODE_ENV || 'development'
      }`,
    }),
    SharedModule,
    UsersModule,
    PostsModule,
    AuthModule,
  ],
})
export class AppModule {}
