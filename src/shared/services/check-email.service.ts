import { HttpService } from '@nestjs/common';
import { ConfigService } from './config.service';

export class CheckEmail {
  mailboxLayerUrl: string;
  mailboxLayerkey: string;
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    (this.mailboxLayerUrl = this.configService.get('MAILBOXLAYER_URL')),
      (this.mailboxLayerkey = this.configService.get('MAILBOXLAYER_KEY'));
  }
}
