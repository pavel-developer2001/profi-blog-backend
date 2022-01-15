import { ArticleEntity } from './../article/entities/article.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
  ) {}

  async create(registerUserDto: RegisterUserDto) {
    try {
      const findUser = await this.repository.findOne({
        where: { email: registerUserDto.email },
      });
      if (findUser) {
        throw new HttpException(
          'Пользователь с таким email уже создан',
          HttpStatus.FORBIDDEN,
        );
      }
      const hashPassword = await bcrypt.hash(registerUserDto.password, 5);
      const user = await this.repository.save({
        name: registerUserDto.name,
        email: registerUserDto.email,
        password: hashPassword,
      });
      const { password, ...userData } = user;
      return userData;
    } catch (error) {
      console.error(error);
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    try {
      const user = await this.repository.findOne({
        where: { id },
      });
      if (!user) {
        throw new HttpException(
          'Пользователь с таким id не найден',
          HttpStatus.NOT_FOUND,
        );
      }

      const articles = await this.articleRepository.find({
        where: { user: { id } },
        order: {
          createdAt: 'DESC',
        },
      });
      return { name: user.name, email: user.email, articles };
    } catch (error) {
      console.error(error);
    }
  }

  async findUser(loginUserDto: LoginUserDto) {
    const user = await this.repository.findOne({
      where: { email: loginUserDto.email },
    });
    if (!user) {
      throw new HttpException(
        'Пользователь с таким email не найден!',
        HttpStatus.NOT_FOUND,
      );
    }
    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isMatch) {
      throw new HttpException('Неверный пароль', HttpStatus.FORBIDDEN);
    }
    return user;
  }
  async findById(id: number) {
    try {
      const user = await this.repository.findOne(id);
      return user;
    } catch (error) {
      console.error(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
