import { Length, IsOptional } from 'class-validator';

export class CreateArticleDto {
  @Length(3, 255)
  title: string;

  @Length(3)
  text: string;

  categories?: any;
}
