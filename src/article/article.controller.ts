import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CategoryService } from 'src/category/category.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User } from 'src/decorators/user.decorator';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    @Inject(forwardRef(() => CloudinaryService))
    private cloudinary: CloudinaryService,
    private categoryService: CategoryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('img'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createArticleDto: CreateArticleDto,
    @User() userId: number,
  ) {
    try {
      const newArticle = await this.articleService.create(
        createArticleDto,
        userId,
      );
      await createArticleDto.categories.map((category) =>
        this.categoryService.create(category, newArticle.id),
      );
      await this.cloudinary.uploadImgArticle(file, newArticle.id);
      return this.articleService.findOne(newArticle.id);
    } catch (error) {
      console.error(error);
    }
  }

  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @User() userId: number,
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.update(+id, updateArticleDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@User() userId: number, @Param('id') id: string) {
    return this.articleService.remove(+id, userId);
  }
}
