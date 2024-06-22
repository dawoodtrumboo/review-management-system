import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common'

import { Place } from './place.dto'
import { PlaceService } from './place.service'

@Controller('/v1/places')
export class PlacesController {
  constructor(private readonly placeService: PlaceService) {}

  @Get()
  async findPlaces(
    @Query('query') query: string,
    @Res() res,
  ): Promise<Place[] | void> {
    if (!query) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: 'Missing required parameter: query or fields',
      })
    }

    try {
      const places = await this.placeService.findPlaces(query)
      const placeArr = places.map(place => {
        return {
          place_id: place.place_id,
          name: place.name,
        }
      })
      return res.status(HttpStatus.OK).json({ results: placeArr })
    } catch (error) {
      console.error('Error fetching places:', error)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Error fetching places',
      })
    }
  }
}
