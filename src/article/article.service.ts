import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { getConnection } from 'typeorm';
import { CommentService } from 'src/comment/comment.service';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleEntity } from './entities/article.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private repository: Repository<ArticleEntity>,
    private categoryService: CategoryService,
    private commentService: CommentService,
    private userService: UserService,
  ) {}

  async create(createArticleDto: CreateArticleDto, userId: number) {
    try {
      const connection = getConnection();
      if (createArticleDto.title.length === 0) {
        throw new HttpException(
          'Вы не ввели название статьи!',
          HttpStatus.FORBIDDEN,
        );
      }
      const categories = [];
      for (const category of createArticleDto.categories) {
        const savedCategory = await this.categoryService.findByName(category);
        categories.push(...savedCategory);
      }
      const article = new ArticleEntity();
      article.title = createArticleDto.title;
      article.text = createArticleDto.text;
      article.user = await this.userService.findById(userId);
      article.categories = categories;
      return await connection.manager.save(article);
    } catch (error) {
      console.error(error);
    }
  }
  async addImg(img: string, id: number) {
    try {
      if (!img) {
        return null;
      }
      await this.repository.update(id, { img });
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      console.error('error', error);
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
    try {
      const article = await this.repository.findOne({ where: { id } });
      if (!article) {
        throw new HttpException('Статья не найдена', HttpStatus.NOT_FOUND);
      }
      return article;
    } catch (error) {
      console.error(error);
    }
  }

  async update(id: number, updateArticleDto: UpdateArticleDto, userId: number) {
    try {
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
    } catch (error) {
      console.error(error);
    }
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

    await this.commentService.removeByArticle(id);
    await this.repository.delete(id);

    return article;
  }
}
