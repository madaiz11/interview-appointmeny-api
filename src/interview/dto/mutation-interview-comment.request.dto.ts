import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MutationInterviewCommentRequestDto {
  @ApiProperty({
    description: 'Comment',
    example: 'This is a comment',
  })
  @IsString()
  @IsNotEmpty()
  comment: string;
}
