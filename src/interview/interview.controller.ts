import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { InterviewDI } from 'src/interview/di/interview.di';
import { GetInterviewDetailResponseDto } from 'src/interview/dto/get-interview-detail.response';
import { GetInterviewListRequestDto } from 'src/interview/dto/get-interview-list.requet.dto';
import { GetInterviewListResponseDto } from 'src/interview/dto/get-interview-list.response';
import { InterviewService } from 'src/interview/interview.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Interview')
@Controller('interview')
export class InterviewController {
  constructor(
    @Inject(InterviewDI.service)
    private readonly interviewService: InterviewService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get interview list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Interview list',
    type: GetInterviewListResponseDto,
  })
  async getInterviewList(
    @Query() request: GetInterviewListRequestDto,
  ): Promise<GetInterviewListResponseDto> {
    return this.interviewService.getInterviewList(request);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get interview detail' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Interview detail',
    type: GetInterviewDetailResponseDto,
  })
  async getInterviewDetail(
    @Param('id') id: string,
  ): Promise<GetInterviewDetailResponseDto> {
    return this.interviewService.getInterviewDetail(id);
  }
}
