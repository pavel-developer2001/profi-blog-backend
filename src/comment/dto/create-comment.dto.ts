import { Length} from 'class-validator';

export class CreateCommentDto {
  @Length(3, 500)
  text: string;

  userId: number;

  articleId: number;
}
