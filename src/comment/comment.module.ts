import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
