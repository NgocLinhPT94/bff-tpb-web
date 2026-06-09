import {
  IsString,
  IsEmail,
  IsEnum,
  IsBoolean,
  IsOptional,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ProductInterest {
  SAVINGS = 'savings',
  LOAN = 'loan',
  CREDIT_CARD = 'credit-card',
  INSURANCE = 'insurance',
  INVESTMENT = 'investment',
  DIGITAL_BANKING = 'digital-banking',
  OTHER = 'other',
}

export enum LeadSource {
  WEBSITE_FORM = 'website-form',
  LANDING_PAGE = 'landing-page',
  CALCULATOR = 'calculator',
  CHATBOT = 'chatbot',
  POPUP = 'popup',
}

export class CreateLeadDto {
  @ApiProperty({ example: 'Nguyen Van A', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fullName!: string;

  @ApiProperty({ example: '0901234567', maxLength: 20 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phoneNumber!: string;

  @ApiPropertyOptional({ example: 'nguyenvana@email.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ enum: ProductInterest, example: ProductInterest.LOAN })
  @IsEnum(ProductInterest)
  productInterest!: ProductInterest;

  @ApiProperty({ enum: LeadSource, example: LeadSource.WEBSITE_FORM })
  @IsEnum(LeadSource)
  source!: LeadSource;

  @ApiPropertyOptional({ example: 'summer-loan-2025', maxLength: 255 })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  campaignSlug?: string;

  @ApiPropertyOptional({ maxLength: 2000 })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  message?: string;

  @ApiPropertyOptional({ example: 'google', maxLength: 100 })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  utmSource?: string;

  @ApiPropertyOptional({ example: 'cpc', maxLength: 100 })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  utmMedium?: string;

  @ApiPropertyOptional({ example: 'summer2025', maxLength: 100 })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  utmCampaign?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  consentGiven!: boolean;

  @ApiPropertyOptional({ description: 'reCAPTCHA v3 token', maxLength: 2048 })
  @IsString()
  @IsOptional()
  @MaxLength(2048)
  captchaToken?: string;
}

export interface LeadSubmitResult {
  success: boolean;
  message: string;
  cmsId?: number;
}
