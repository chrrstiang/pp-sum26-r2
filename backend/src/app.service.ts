import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { Venue } from '../../types';
import * as venuesData from '../venues.json';

@Injectable()
export class AppService {
  private openai: OpenAI;
  private venues: Venue[];

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.venues = venuesData as Venue[];
  }

  getHello(): string {
    return 'Hello World!';
  }
}
