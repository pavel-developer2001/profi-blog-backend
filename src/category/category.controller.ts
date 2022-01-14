import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CategoryService } from 'src/category/category.service';
import { User } from 'src/decorators/user.decorator';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  async create(@Body() category: string) {
    try {
      return this.categoryService.create(category);
    } catch (error) {
      console.error(error);
    }
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  //   @UseGuards(JwtAuthGuard)
  //   @Patch(':id')
  //   update(
  //     @User() userId: number,
  //     @Param('id') id: string,
  //     @Body() updateArticleDto: UpdateArticleDto,
  //   ) {
  //     return this.articleService.update(+id, updateArticleDto, userId);
  //   }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
