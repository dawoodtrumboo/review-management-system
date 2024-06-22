import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseHelperModule } from '../../../core/database'
import { BusinessPlace } from './buisinessPlace.model'
import { BusinessPlaceDomainFacade } from './businessPlace.domain.facade'

@Module({
  imports: [TypeOrmModule.forFeature([BusinessPlace]), DatabaseHelperModule],
  providers: [BusinessPlaceDomainFacade, BusinessPlaceDomainFacade],
  exports: [BusinessPlaceDomainFacade],
})
export class ReviewDomainModule {}
