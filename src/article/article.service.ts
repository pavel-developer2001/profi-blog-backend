import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private repository: Repository<ArticleEntity>,
  ) {}

  create(createArticleDto: CreateArticleDto) {
    if (createArticleDto.title.length === 0) {
      throw new HttpException(
        'Вы не ввели название статьи!',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.repository.save({
      ...createArticleDto,
      user: { id: createArticleDto.userId },
    });
  }

  findAll() {
    return this.repository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const article = await this.repository.findOne({ where: { id } });
    if (!article) {
      throw new HttpException('Статья не найдена', HttpStatus.NOT_FOUND);
    }
    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    const article = await this.repository.findOne({ where: { id } });
    if (!article) {
      throw new HttpException('Статья не найдена', HttpStatus.NOT_FOUND);
    }
    await this.repository.update(id, {
      title: updateArticleDto.title,
      text: updateArticleDto.text,
    });
    return await this.repository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const article = await this.repository.findOne({ where: { id } });
    if (!article) {
      throw new HttpException('Статья не найдена', HttpStatus.NOT_FOUND);
    }
    await this.repository.delete(id);
    return article;
  }
}
