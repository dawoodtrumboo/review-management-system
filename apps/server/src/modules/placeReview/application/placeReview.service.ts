import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import axios, { AxiosResponse } from 'axios'
import { PlaceReview } from './placeReview.dto'

@Injectable()
export class PlaceReviewService {
  constructor(private readonly httpService: HttpService) {}
  private readonly baseUrl =
    'https://maps.googleapis.com/maps/api/place/details/json'

  private readonly apiKey = 'AIzaSyCepji1_naZlXUkcoVtZ0ao-uJPnK8FDhg' // Replace with your API key

  async findPlaceDetails(
    place_id: string,
    fields: string,
  ): Promise<PlaceReview> {
    const url = new URL(this.baseUrl)
    url.searchParams.append('key', this.apiKey)
    url.searchParams.append('place_id', place_id)
    url.searchParams.append('fields', fields)

    try {
      const response: AxiosResponse<{ result: PlaceReview; status: string }> =
        await axios.get(url.toString())

      if (response.data.status === 'OK') {
        return response.data.result
      } else {
        throw new Error(`Error fetching places: ${response.data.status}`)
      }
    } catch (error) {
      console.error('Error fetching places:', error)
      throw error
    }
  }
}
