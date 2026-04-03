import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VenueController } from './venue.controller';
import { VenueService } from './venue.service';

@Module({
  imports: [],
  controllers: [AppController, VenueController],
  providers: [AppService, VenueService],
})
export class AppModule {}
