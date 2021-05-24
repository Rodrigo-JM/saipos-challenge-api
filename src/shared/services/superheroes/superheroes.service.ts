import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '../config.service';
import { SuperheroDto } from './dto/superhero.dto';

@Injectable()
export class SuperheroesService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async fetchSuperheroes(): Promise<any[]> {
    try {
      const superheroesUrl = this.configService.get('SUPERHEROES_URL');
      const superheroesKey = this.configService.get('SUPERHEROES_KEY');

      const randomIds = this.getThreeRandomIds(1, 700);

      const calls = randomIds.map((id) => {
        return this.httpService
          .get(`${superheroesUrl}/${superheroesKey}/${id}/biography`)
          .toPromise();
      });

      console.log(calls);
      return Promise.all(calls);
    } catch (error) {
      return error;
    }
  }

  getThreeRandomIds(min: number, max: number): number[] {
    min = Math.ceil(min);
    max = Math.floor(max);
    return [
      Math.floor(Math.random() * (max - min + 1)) + min,
      Math.floor(Math.random() * (max - min + 1)) + min,
      Math.floor(Math.random() * (max - min + 1)) + min,
    ];
  }
}
