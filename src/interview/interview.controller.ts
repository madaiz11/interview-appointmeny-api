import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/entities';
import { InterviewDI } from 'src/interview/di/interview.di';
import { GetInterviewCommentListRequestDto } from 'src/interview/dto/get-interview-comment-list.request';
import { GetInterviewCommentListResponseDto } from 'src/interview/dto/get-interview-comment-list.response';
import { GetInterviewDetailResponseDto } from 'src/interview/dto/get-interview-detail.response';
import { GetInterviewListRequestDto } from 'src/interview/dto/get-interview-list.request.dto';
import { GetInterviewListResponseDto } from 'src/interview/dto/get-interview-list.response';
import { GetInterviewLogListRequestDto } from 'src/interview/dto/get-interview-log-list.request.dto';
import { GetInterviewLogListResponseDto } from 'src/interview/dto/get-interview-log-list.response';
import { MutationInterviewCommentRequestDto } from 'src/interview/dto/mutation-interview-comment.request.dto';
import { UpdateInterviewDetailRequestDto } from 'src/interview/dto/update-interview-detail.request.dto';
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

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get interview comment list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Interview comment list',
    type: GetInterviewCommentListResponseDto,
  })
  async getInterviewCommentList(
    @Param('id') id: string,
    @Query() request: GetInterviewCommentListRequestDto,
    @Request() req: Express.Request & { user: User },
  ): Promise<GetInterviewCommentListResponseDto> {
    return this.interviewService.getInterviewCommentList(id, request, req.user);
  }

  @Get(':id/logs')
  @ApiOperation({ summary: 'Get interview log list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Interview log list',
    type: GetInterviewLogListResponseDto,
  })
  async getInterviewLogList(
    @Param('id') id: string,
    @Query() request: GetInterviewLogListRequestDto,
  ): Promise<GetInterviewLogListResponseDto> {
    return this.interviewService.getInterviewLogList(id, request);
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

  @Post(':id/comment')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create interview comment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Interview comment created',
  })
  async createInterviewComment(
    @Param('id') id: string,
    @Body() request: MutationInterviewCommentRequestDto,
    @Request() req: Express.Request & { user: User },
  ): Promise<void> {
    return this.interviewService.createInterviewComment(
      id,
      request.comment,
      req.user,
    );
  }

  @Put(':id/comment/:commentId')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Update interview comment' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Interview comment updated',
  })
  async updateInterviewComment(
    @Param('commentId') commentId: string,
    @Body() request: MutationInterviewCommentRequestDto,
    @Request() req: Express.Request & { user: User },
  ): Promise<void> {
    return this.interviewService.updateInterviewComment(
      commentId,
      request.comment,
      req.user,
    );
  }

  @Patch(':id/detail')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Update interview detail' })
  @ApiBody({ type: UpdateInterviewDetailRequestDto })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Interview detail',
    type: GetInterviewDetailResponseDto,
  })
  async updateInterviewDetail(
    @Param('id') id: string,
    @Body() request: UpdateInterviewDetailRequestDto,
    @Request() req: Express.Request & { user: User },
  ): Promise<void> {
    return this.interviewService.updateInterviewDetail(id, request, req.user);
  }

  @Patch(':id/archive')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Archive interview' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Interview archived',
  })
  async archiveInterview(@Param('id') id: string): Promise<void> {
    return this.interviewService.archiveInterview(id);
  }

  @Delete(':id/comment/:commentId')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Delete interview comment' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Interview comment deleted',
  })
  async deleteInterviewComment(
    @Param('commentId') commentId: string,
    @Request() req: Express.Request & { user: User },
  ): Promise<void> {
    return this.interviewService.deleteInterviewComment(commentId, req.user);
  }
}
