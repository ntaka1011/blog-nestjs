import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])], // Nơi mình nạp các module khác vào or các thư viện
  controllers: [CategoryController], // khai báo các controller của trong module đó vào
  providers: [CategoryService], //  có thằng @InjectAble() add providers
})
export class CategoryModule {}
