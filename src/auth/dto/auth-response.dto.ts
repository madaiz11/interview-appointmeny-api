import { ApiProperty } from '@nestjs/swagger';

export class UserAccountDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({
    example: 'admin',
    enum: ['admin', 'hr', 'interviewer', 'candidate'],
  })
  type: string;

  @ApiProperty({ example: 'IT', nullable: true })
  department: string;

  @ApiProperty({ example: 'System Administrator', nullable: true })
  position: string;

  @ApiProperty({ example: true })
  isActive: boolean;
}

export class UserDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'admin@example.com' })
  email: string;

  @ApiProperty({ example: 'Admin User' })
  name: string;

  @ApiProperty({ type: [UserAccountDto] })
  accounts: UserAccountDto[];
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  access_token: string;

  @ApiProperty({ example: 'Bearer' })
  token_type: string;

  @ApiProperty({ type: UserDto })
  user: UserDto;
}
