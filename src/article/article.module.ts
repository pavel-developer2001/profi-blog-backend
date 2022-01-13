import { CategoryModule } from './../category/category.module';
import { forwardRef, Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forFeature([ArticleEntity]),
    forwardRef(() => CloudinaryModule),
    CategoryModule,
    CommentModule
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
