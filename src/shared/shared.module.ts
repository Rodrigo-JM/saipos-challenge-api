import { Global, HttpModule, Module } from '@nestjs/common';
import { ConfigService } from './services/config.service';
import { CheckEmailService } from './services/check-email/check-email.service';
import { SuperheroesService } from './services/superheroes/superheroes.service';

const providers = [ConfigService, CheckEmailService, SuperheroesService];
@Global()
@Module({
  providers,
  imports: [HttpModule],
  exports: [...providers, HttpModule],
})
export class SharedModule {}
