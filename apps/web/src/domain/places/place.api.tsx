import { HttpService } from '@web/core/http'
import { ApiHelper } from '../helpers/api.helper'
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

  static reviewsByPlace(values: paramType): Promise<ReviewList> {
    return HttpService.api.post('/v1/placeReviews', values)
  }
}
