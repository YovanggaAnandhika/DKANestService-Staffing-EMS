import { Module } from '@nestjs/common';
import { ModuleModule } from './module/module.module';

@Module({
  imports: [ModuleModule],
})
export class AppModule {}