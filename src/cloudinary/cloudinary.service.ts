import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream from 'buffer-to-stream';
import { ArticleService } from 'src/article/article.service';
@Injectable()
export class CloudinaryService {
  constructor(
    @Inject(forwardRef(() => ArticleService))
    private articleService: ArticleService,
  ) {}
  async uploadImgArticle(file: Express.Multer.File, id: number): Promise<any> {
    if (!file) {
      return '';
    }
    v2.uploader
      .upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error || !result) {
          console.error('ERRRRRRRRRROOOOOOOOORR ', error);
        }
        this.articleService.addImg(result.url, id);
      })
      .end(file.buffer);
  }
}
