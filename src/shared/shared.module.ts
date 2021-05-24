import { Global, HttpModule, Module } from '@nestjs/common';
import { ConfigService } from './services/config.service';

@Global()
@Module({
  providers: [ConfigService],
  imports: [HttpModule],
  exports: [ConfigService, HttpModule],
})
export class SharedModule {}
