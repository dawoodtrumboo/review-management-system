import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common'

import { PlaceReview } from './placeReview.dto'
import { PlaceReviewService } from './placeReview.service'

@Controller('/v1/placeReviews')
export class PlaceReviewController {
  constructor(private readonly placeReviewService: PlaceReviewService) {}

  @Post()
  async findPlaceDetails(
    @Body('place_id') place_id: string,
    @Body('fields') fields: string,
    @Res() res,
    @Body('rating') rating?: number,
    @Body('startDate') startDate?: string,
    @Body('endDate') endDate?: string,
  ): Promise<PlaceReview | void> {
    if (!place_id || !fields) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: 'Missing required parameter: place_id or fields',
      })
    }

    // Validate rating if provided
    if (rating !== undefined && (isNaN(rating) || rating < 0 || rating > 5)) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message:
          'Invalid rating parameter. It should be a number between 0 and 5.',
      })
    }

    // Validate and parse dates
    let start: Date | null = null
    let end: Date | null = null
    if (startDate) {
      start = new Date(startDate)
      if (isNaN(start.getTime())) {
        return res.status(HttpStatus.BAD_REQUEST).send({
          message: 'Invalid startDate parameter.',
        })
      }

      if (endDate) {
        end = new Date(endDate)
        if (isNaN(end.getTime())) {
          return res.status(HttpStatus.BAD_REQUEST).send({
            message: 'Invalid endDate parameter.',
          })
        }
      }
    }

    try {
      let reviewDetails = await this.placeReviewService.findPlaceDetails(
        place_id,
        fields,
      )
      // Filter by rating if provided
      if (rating) {
        reviewDetails = {
          ...reviewDetails,
          reviews: reviewDetails.reviews.filter(
            item =>
              item.rating >= Number(rating) && item.rating < Number(rating) + 1,
          ),
        }
      }

      // Filter by date range if provided
      if (start || end) {
        reviewDetails = {
          ...reviewDetails,
          reviews: reviewDetails.reviews.filter(item => {
            const reviewDate = new Date(item.time * 1000) // Convert Unix timestamp (seconds) to Date
            if (isNaN(reviewDate.getTime())) return false // Invalid date in review

            if (start && end) {
              return reviewDate >= start && reviewDate <= end
            } else if (start) {
              return reviewDate >= start
            } else if (end) {
              return reviewDate <= end
            }
            return true
          }),
        }
      }

      return res.status(HttpStatus.OK).json(reviewDetails)
    } catch (error) {
      console.error('Error fetching places:', error)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Error fetching places',
      })
    }
  }
}
