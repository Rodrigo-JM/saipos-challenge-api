import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '../config.service';
import { CheckEmailOutputDto } from './dto/check-email-output.dto';

@Injectable()
export class CheckEmailService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async checkEmail(email: string): Promise<CheckEmailOutputDto> {
    try {
      const mailboxLayerUrl = this.configService.get('MAILBOXLAYER_URL');
      const mailboxLayerKey = this.configService.get('MAILBOXLAYER_KEY');
      const response = await this.httpService
        .get(`${mailboxLayerUrl}?access_key=${mailboxLayerKey}&email=${email}`)
        .toPromise();

      return response.data;
    } catch (error) {
      return error;
    }
  }
}
