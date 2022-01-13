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

  create(createCommentDto: CreateCommentDto, userId: number) {
    return this.repository.save({
      ...createCommentDto,
      user: { id: userId },
      article: { id: createCommentDto.articleId },
    });
  }

  async findAll(id: string) {
    try {
      const comments = await this.repository.find({
        where: { article: { id } },
        order: {
          createdAt: 'DESC',
        },
      });
      return comments;
    } catch (error) {
      console.error(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
  async removeByArticle(id: number) {
    try {
      const findComments = await this.repository.find({
        where: { article: { id } },
      });
      return findComments.map((item) => this.repository.delete(item.id));
    } catch (error) {
      console.error(error);
    }
  }
}
