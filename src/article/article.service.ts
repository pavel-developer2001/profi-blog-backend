import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private repository: Repository<ArticleEntity>,
    private cloudinary: CloudinaryService,
  ) {}

  async create(createArticleDto: any, userId: number) {
    try {
      console.log('EIGIEA', createArticleDto);
      if (createArticleDto.title.length === 0) {
        throw new HttpException(
          'Вы не ввели название статьи!',
          HttpStatus.FORBIDDEN,
        );
      }
      // console.log('file', createArticleDto.img);
      // const test = await this.cloudinary.uploadImage(createArticleDto.img);
      // console.log(test);
      return this.repository.save({
        ...createArticleDto,
        user: { id: userId },
      });
    } catch (error) {
      console.error(error);
    }
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

  async update(id: number, updateArticleDto: UpdateArticleDto, userId: number) {
    const article = await this.repository.findOne({ where: { id } });
    if (!article) {
      throw new HttpException('Статья не найдена', HttpStatus.NOT_FOUND);
    }
    if (article.user.id !== userId) {
      throw new HttpException(
        'Вы не можете редактировать эту статью',
        HttpStatus.FORBIDDEN,
      );
    }
    await this.repository.update(id, {
      title: updateArticleDto.title,
      text: updateArticleDto.text,
      user: { id: userId },
    });
    return await this.repository.findOne({ where: { id } });
  }

  async remove(id: number, userId: number) {
    const article = await this.repository.findOne({ where: { id } });
    if (!article) {
      throw new HttpException('Статья не найдена', HttpStatus.NOT_FOUND);
    }
    if (article.user.id !== userId) {
      throw new HttpException(
        'Вы не можете удалить эту статью',
        HttpStatus.FORBIDDEN,
      );
    }
    await this.repository.delete(id);
    return article;
  }
}
