import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private repository: Repository<CommentEntity>,
  ) {}

  create(createCommentDto: CreateCommentDto) {
    return this.repository.save({
      ...createCommentDto,
      user: { id: createCommentDto.userId },
      article: { id: createCommentDto.articleId },
    });
  }

  async findAll(id: string) {
    const comments = await this.repository.find({
      where: { article: { id } },
      order: {
        createdAt: 'DESC',
      },
    });
    return comments;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
