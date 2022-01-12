import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { UserEntity } from './user/entities/user.entity';
import { ArticleModule } from './article/article.module';
import { ArticleEntity } from './article/entities/article.entity';
import { CommentModule } from './comment/comment.module';
import { CommentEntity } from './comment/entities/comment.entity';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CategoryModule } from './category/category.module';
import { CategoryEntity } from './category/entities/category.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [UserEntity, ArticleEntity, CommentEntity, CategoryEntity],
      synchronize: true,
    }),
    UserModule,
    ArticleModule,
    CommentModule,
    AuthModule,
    CloudinaryModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
