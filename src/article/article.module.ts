import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forFeature([ArticleEntity]),
    CloudinaryModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
