import { Module } from '@nestjs/common';
import { StrapiModule } from '../../infrastructure/strapi/strapi.module';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';

@Module({
  imports: [StrapiModule],
  controllers: [AuthorsController],
  providers: [AuthorsService],
  exports: [AuthorsService],
})
export class AuthorsModule {}
