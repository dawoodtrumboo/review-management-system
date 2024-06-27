import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseHelperModule } from '../../../core/database'
import { PlaceDomainFacade } from './place.domain.facade'
import { Place } from './place.model'

@Module({
  imports: [TypeOrmModule.forFeature([Place]), DatabaseHelperModule],
  providers: [PlaceDomainFacade, PlaceDomainFacade],
  exports: [PlaceDomainFacade],
})
export class PlaceDomainModule {}
