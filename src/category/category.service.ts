import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private repository: Repository<CategoryEntity>,
  ) {}
  create(category: any) {
    const value = category.category;
    return this.repository.save({ name: value });
  }
  findByArticle(id: number) {
    return this.repository.find({ where: { article: { id } } });
  }
  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number) {
    return `This action updates a #${id} category`;
  }

  async remove(id: number) {
    try {
      return 'THis is' + id;
    } catch (error) {
      console.error(error);
    }
  }
  async findByName(name: string) {
    const cat = await this.repository.find({ where: { name } });
    return cat;
  }
}
