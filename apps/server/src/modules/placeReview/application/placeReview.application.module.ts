import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { PlaceReviewController } from './placeReview.controller'
import { PlaceReviewService } from './placeReview.service'

@Module({
  imports: [HttpModule],
  controllers: [PlaceReviewController],
  providers: [PlaceReviewService],
})
export class PlaceReviewModule {}
