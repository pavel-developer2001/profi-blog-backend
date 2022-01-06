import { ArticleEntity } from './../article/entities/article.entity';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

console.log('sdvas', process.env.SECRET_KEY);
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ArticleEntity]),
    JwtModule.register({
      secret: 'secret key',
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
