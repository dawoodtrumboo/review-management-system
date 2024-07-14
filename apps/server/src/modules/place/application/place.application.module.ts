import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { EventModule } from '@server/libraries/event'
import { GoogleService } from '@server/libraries/google'
import { AuthenticationDomainModule } from '@server/modules/authentication/domain'
import { PlaceDomainModule } from '../domain'
import { PlacesController } from './place.controller'
import { PlaceService } from './place.service'

@Module({
  imports: [
    HttpModule,
    AuthenticationDomainModule,
    EventModule,
    PlaceDomainModule,
  ],
  controllers: [PlacesController],
  providers: [PlaceService, GoogleService],
})
export class PlaceModule {}
