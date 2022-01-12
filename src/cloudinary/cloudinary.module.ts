import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';
import { ConfigModule } from '@nestjs/config';
import { ArticleModule } from 'src/article/article.module';
import { ArticleService } from 'src/article/article.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    // ArticleService,
    ArticleModule,
  ],
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
