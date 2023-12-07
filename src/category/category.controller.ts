import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @UseGuards(AuthGuard)
  getAll(): Promise<Category[]> {
    return this.categoryService.getAll();
  }
}
