import { ArticleEntity } from './../article/entities/article.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
    private jwtService: JwtService,
  ) {}

  async create(registerUserDto: RegisterUserDto) {
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
    const token = this.jwtService.sign({
      id: user.id,
      name: user.name,
      email: user.email,
    });
    return { id: user.id, name: user.name, email: user.email, token: token };
  }

  async authUser(loginUserDto: LoginUserDto) {
    const findUser = await this.repository.findOne({
      where: { email: loginUserDto.email },
    });
    if (!findUser) {
      throw new HttpException(
        'Пользователь с таким email не найден!',
        HttpStatus.NOT_FOUND,
      );
    }
    const isMatch = await bcrypt.compare(
      loginUserDto.password,
      findUser.password,
    );
    if (!isMatch) {
      throw new HttpException('Неверный пароль', HttpStatus.FORBIDDEN);
    }
    const token = this.jwtService.sign({
      id: findUser.id,
      name: findUser.name,
      email: findUser.email,
    });
    return {
      id: findUser.id,
      name: findUser.name,
      email: findUser.email,
      token: token,
    };
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
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
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
