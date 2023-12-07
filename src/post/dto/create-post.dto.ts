import { IsNotEmpty } from 'class-validator';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';

export class CreatePostDTO {
  title: string;

  desription: string;

  thumbnail: string;

  status: number;

  user: User;

  @IsNotEmpty()
  category: Category;
}
