import { Request } from 'express'

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common'
import { EventService } from '@server/libraries/event'
import { GoogleService } from '@server/libraries/google'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { Review, ReviewDomainFacade } from '@server/modules/review/domain'
import { RequestHelper } from '../../../helpers/request'
import { ReviewApplicationEvent } from './review.application.event'
import { ReviewCreateDto, ReviewUpdateDto } from './review.dto'

@Controller('/v1/reviews')
export class ReviewController {
  constructor(
    private eventService: EventService,
    private reviewDomainFacade: ReviewDomainFacade,
    private authenticationDomainFacade: AuthenticationDomainFacade,
    private googleService: GoogleService,
  ) {}

  @Get('/')
  async findMany(@Req() request: Request) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const items = await this.reviewDomainFacade.findMany(queryOptions)

    return items
  }

  @Post('/')
  async create(@Body() body: ReviewCreateDto, @Req() request: Request) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const item = await this.reviewDomainFacade.create(body)

    await this.eventService.emit<ReviewApplicationEvent.ReviewCreated.Payload>(
      ReviewApplicationEvent.ReviewCreated.key,
      {
        id: item.id,
        userId: user.id,
      },
    )

    return item
  }

  @Get('/getByPlaceId/:place_id')
  async findManyByPlaceId(
    @Param('place_id') place_id: string,
    @Req() request: Request,
    @Res() res,
  ): Promise<{
    name: string
    rating: number
    user_ratings_total: number
    reviews: Review[]
  }> {
    const queryOptions = RequestHelper.getQueryOptions(request)

    if (!queryOptions) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: 'Missing required parameter: place_id or fields',
      })
    }

    // Validate and parse dates
    let start: Date | null = null
    let end: Date | null = null
    if (queryOptions.filters.startDate) {
      start = new Date(queryOptions.filters.startDate)
      if (isNaN(start.getTime())) {
        return res.status(HttpStatus.BAD_REQUEST).send({
          message: 'Invalid startDate parameter.',
        })
      }

      if (queryOptions.filters.endDate) {
        end = new Date(queryOptions.filters.endDate)
        if (isNaN(end.getTime())) {
          return res.status(HttpStatus.BAD_REQUEST).send({
            message: 'Invalid endDate parameter.',
          })
        }
      }
    }

    try {
      // API to get reviews from google
      const fields = queryOptions.includes
        .filter(field => field !== null)
        .join(',')

      const normalizeReview = review => {
        return {
          id: review.id || null,
          author_name: review.author_name,
          reviewText: review.text || review.reviewText, // Use whichever key exists
          reviewDate:
            review.reviewDate || new Date(review.time * 1000).toISOString(), // Normalize reviewDate from time
          rating: review.rating || null,
          replyId: review.replyId || null,
          place_id: review.place_id || null,
          status: review.status || null,
          // Add more properties as needed
        }
      }
      const removeDuplicates = reviews => {
        const uniqueReviews = []
        const seenAuthors = new Map()

        reviews.forEach(review => {
          const existingReview = seenAuthors.get(review.author_name)
          if (!existingReview || (!existingReview.id && review.id)) {
            if (existingReview) {
              uniqueReviews.splice(uniqueReviews.indexOf(existingReview), 1)
            }
            uniqueReviews.push(review)
            seenAuthors.set(review.author_name, review)
          } else if (!existingReview) {
            uniqueReviews.push(review)
            seenAuthors.set(review.author_name, review)
          }
        })

        return uniqueReviews
      }

      const reviewDetailsFromGoogle = await this.googleService.findPlaceDetails(
        place_id,
        fields,
      )
      // API to get reviews from database
      const reviewDetailsFromDB =
        await this.reviewDomainFacade.findManyByPlaceIdOrFail(place_id)

      // Normalize reviews from Google and DB
      const normalizedGoogleReviews =
        reviewDetailsFromGoogle.reviews.map(normalizeReview)
      const normalizedDBReviews = reviewDetailsFromDB.map(normalizeReview)

      const mergedReviews = removeDuplicates([
        ...normalizedGoogleReviews,
        ...normalizedDBReviews,
      ])
      let placeDetails = {
        name: reviewDetailsFromGoogle.name,
        rating: reviewDetailsFromGoogle.rating,
        user_ratings_total: reviewDetailsFromGoogle.user_ratings_total,
        reviews: mergedReviews,
      }

      if (start || end) {
        placeDetails.reviews = placeDetails.reviews.filter(item => {
          const reviewDate = new Date(item.reviewDate)
          // if (isNaN(reviewDate.getTime())) return false // Invalid date in review

          if (start && end) {
            return reviewDate >= start && reviewDate <= end
          } else if (start) {
            return reviewDate >= start
          } else if (end) {
            return reviewDate <= end
          }
          return true
        })
      }

      return res.status(HttpStatus.OK).json(placeDetails)
    } catch (error) {
      console.log('Error in fetching place Details', error)
      throw error
    }
  }

  @Get('/:reviewId')
  async findOne(@Param('reviewId') reviewId: string, @Req() request: Request) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const item = await this.reviewDomainFacade.findOneByIdOrFail(
      reviewId,
      queryOptions,
    )

    return item
  }

  // @Get('/:placeId')
  // async findOneByPlaceId(
  //   @Param('placeId') placeId: string,
  //   @Req() request: Request,
  // ) {
  //   const queryOptions = RequestHelper.getQueryOptions(request)

  //   const item = await this.reviewDomainFacade.findOneByPlaceIdOrFail(
  //     placeId,
  //     queryOptions,
  //   )

  //   return item
  // }

  @Patch('/:reviewId')
  async update(
    @Param('reviewId') reviewId: string,
    @Body() body: ReviewUpdateDto,
  ) {
    const item = await this.reviewDomainFacade.findOneByIdOrFail(reviewId)

    const itemUpdated = await this.reviewDomainFacade.update(
      item,
      body as Partial<Review>,
    )
    return itemUpdated
  }

  @Delete('/:reviewId')
  async delete(@Param('reviewId') reviewId: string) {
    const item = await this.reviewDomainFacade.findOneByIdOrFail(reviewId)

    await this.reviewDomainFacade.delete(item)

    return item
  }
}
