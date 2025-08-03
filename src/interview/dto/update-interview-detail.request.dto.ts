import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { MasterInterviewStatusCode } from 'src/shared/enum/master/interview-status-code.enum';

export class UpdateInterviewDetailRequestDto {
  @ApiProperty({
    description: 'The title of the interview',
    example: 'Interview Title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The description of the interview',
    example: 'Interview Description',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The status code of the interview',
    example: 'IS01',
  })
  @IsNotEmpty()
  @IsEnum(MasterInterviewStatusCode)
  statusCode: MasterInterviewStatusCode;
}
