import { ApiProperty } from '@nestjs/swagger';
import { ValidateIf } from 'class-validator';

export class FilterUserDTO {
  @ApiProperty()
  page: string;

  @ApiProperty()
  item_per_page: string;

  @ApiProperty()
  @ValidateIf((object, value) => value !== null)
  search: string;
}
