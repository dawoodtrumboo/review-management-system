import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import axios, { AxiosResponse } from 'axios'
import { Place } from './place.dto'

@Injectable()
export class PlaceService {
  constructor(private readonly httpService: HttpService) {}
  private readonly baseUrl =
    'https://maps.googleapis.com/maps/api/place/textsearch/json'

  private readonly apiKey = 'AIzaSyCepji1_naZlXUkcoVtZ0ao-uJPnK8FDhg' // Replace with your API key

  async findPlaces(query: string): Promise<Place[]> {
    const url = new URL(this.baseUrl)
    url.searchParams.append('key', this.apiKey)
    url.searchParams.append('query', query)
    url.searchParams.append('language', 'en')

    try {
      const response: AxiosResponse<{ results: Place[]; status: string }> =
        await axios.post(url.toString())

      if (response.data.status === 'OK') {
        return response.data.results
      } else {
        throw new Error(`Error fetching places: ${response.data.status}`)
      }
    } catch (error) {
      console.error('Error fetching places:', error)
      throw error
    }
  }

  // try {
  //   const response: AxiosResponse<{ places: Place[] }> = await axios.post(
  //     url.toString(),
  //     data,
  //     { headers },
  //   )

  //   if (response) {
  //     return response.data.places
  //   } else {
  //     throw new Error(`Error fetching places}`)
  //   }
  // } catch (error) {
  //   console.error('Error fetching places', error)
  //   throw error
  // }

  //   async findNearByPlaces(
  //     fields: string,
  //     input: string,
  //   ): Promise<Place[]> {
  //     const url = new URL(this.baseUrl)
  //     url.searchParams.append('fields', fields)
  //     url.searchParams.append('input', input)

  //     try {
  //       const response: AxiosResponse<NearByPlacesResponse> = await axios.get(
  //         url.toString(),
  //       )

  //       if (response.data.status === 'OK') {
  //         return response.data.results
  //       } else {
  //         throw new Error(`Error fetching places: ${response.data.status}`)
  //       }
  //     } catch (error) {
  //       console.error('Error fetching places:', error)
  //       throw error
  //     }
  //   }
}
