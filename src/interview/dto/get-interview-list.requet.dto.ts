import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class GetInterviewListRequestDto {
  @ApiProperty({
    description: 'The page number',
    example: 1,
  })
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  page: number;

  @ApiProperty({
    description: 'The limit number',
    example: 3,
  })
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  limit: number;
}
