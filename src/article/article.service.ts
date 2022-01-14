import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { getConnection } from 'typeorm';
import { CommentService } from 'src/comment/comment.service';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private repository: Repository<ArticleEntity>,
    private categoryService: CategoryService,
    private commentService: CommentService,
  ) {}

  async create(createArticleDto: CreateArticleDto, userId: number) {
    try {
      console.log('dto', createArticleDto);
      const connection = getConnection();
      if (createArticleDto.title.length === 0) {
        throw new HttpException(
          'Вы не ввели название статьи!',
          HttpStatus.FORBIDDEN,
        );
      }
      // const artilce = await this.repository.save({
      //   ...createArticleDto,
      //   user: { id: userId },
      // });
      // console.log('articlesdsasdvas', artilce);
      const article = new ArticleEntity();
      console.log('user', article);
      article.title = createArticleDto.title;
      article.text = createArticleDto.text;
      article.user.id = userId;
      article.categories = createArticleDto.categories;
      console.log('article', article);
      const test = await connection.manager.save(article);
      console.log('test', test);
      return test;
      // return await this.repository.save({
      //   ...createArticleDto,
      //   user: { id: userId },
      // });
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
      const categories = await this.categoryService.findByArticle(article.id);
      return { article, categories };
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

    await this.categoryService.remove(id);
    await this.commentService.removeByArticle(id);
    await this.repository.delete(id);

    return article;
  }
}
