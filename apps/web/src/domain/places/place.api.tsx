import { HttpService } from '@web/core/http'
import { Review } from '../review'
import { Place, ReviewList } from './place.model'

type paramType = {
  place_id: string
  fields: string
  rating: number
  startDate: string
  endDate: string
}
export class PlaceApi {
  static findPlaces(query: string): Promise<{ results: Place[] }> {
    return HttpService.api.get(`/v1/places?query=${query}`)
  }

  static createPlace(body: Place): Promise<Place> {
    return HttpService.api.post('/v1/places', body)
  }

  static findByUserId(userId: string): Promise<Place[]> {
    return HttpService.api.get(`/v1/places?userId=${userId}`)
  }

  // Old APis
  static reviewsByPlace(values: paramType): Promise<ReviewList> {
    return HttpService.api.post('/v1/placeReviews', values)
  }

  static reviewByPlaceId(placeId: string): Promise<Review[]> {
    return HttpService.api.get(`/v1/reviews?placeId=${placeId}`)
  }
}
