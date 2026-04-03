import { Controller, Post, Body } from '@nestjs/common';
import { VenueService } from './venue.service';

@Controller('venues')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @Post('search')
  async searchVenues(@Body() body: { query: string }) {
    return this.venueService.searchVenues(body.query);
  }
}
