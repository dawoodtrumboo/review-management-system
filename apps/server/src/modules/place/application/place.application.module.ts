import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { PlacesController } from './place.controller'
import { PlaceService } from './place.service'

@Module({
  imports: [HttpModule],
  controllers: [PlacesController],
  providers: [PlaceService],
})
export class PlaceModule {}
