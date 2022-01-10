import { Length, IsOptional } from 'class-validator';

export class UpdateArticleDto {
  @Length(3, 255)
  title: string;

  @Length(3)
  text: string;

  @IsOptional()
  img?: string;
}
