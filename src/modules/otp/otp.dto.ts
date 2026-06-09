import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({ example: '0901234567', description: 'Phone number to send OTP to' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phoneNumber!: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '0901234567', description: 'Phone number the OTP was sent to' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phoneNumber!: string;

  @ApiProperty({ example: '123456', description: 'OTP code to verify' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  code!: string;
}

export class OtpSendResultDto {
  @ApiProperty({ example: true, description: 'Whether OTP was sent successfully' })
  success!: boolean;

  @ApiProperty({ example: 'OTP đã được gửi thành công', description: 'Status message' })
  message!: string;
}

export class OtpVerifyResultDto {
  @ApiProperty({ example: true, description: 'Whether OTP verification passed' })
  valid!: boolean;

  @ApiProperty({ example: 'Xác thực thành công', description: 'Status message' })
  message!: string;
}
