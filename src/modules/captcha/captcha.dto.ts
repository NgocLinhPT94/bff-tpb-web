import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyCaptchaDto {
  @ApiProperty({ description: 'reCAPTCHA v3 token from client', example: '03AGdBq26...' })
  @IsString()
  @IsNotEmpty()
  token!: string;
}

export class CaptchaResultDto {
  @ApiProperty({ example: true, description: 'Whether the token is valid' })
  success!: boolean;

  @ApiProperty({ example: 0.9, description: 'Risk score (0.0 - 1.0, higher is more likely human)' })
  score!: number;
}
