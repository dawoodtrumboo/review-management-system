import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common'
import { RequestHelper } from '@server/helpers/request'
import { EventService } from '@server/libraries/event'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { Request } from 'express'
import { PlaceDomainFacade } from '../domain'
import { PlaceApplicationEvent } from './place.application.event'
import { PlaceCreateDto } from './place.dto'
import { PlaceService } from './place.service'

@Controller('/v1/places')
export class PlacesController {
  constructor(
    private readonly placeService: PlaceService,
    private authenticationDomainFacade: AuthenticationDomainFacade,
    private placeDomainFacade: PlaceDomainFacade,
    private eventService: EventService,
  ) {}

  // @Get()
  // async findPlaces(
  //   @Query('query') query: string,
  //   @Res() res,
  // ): Promise<Place[] | void> {
  //   if (!query) {
  //     return res.status(HttpStatus.BAD_REQUEST).send({
  //       message: 'Missing required parameter: query or fields',
  //     })
  //   }

  //   try {
  //     const places = await this.placeService.findPlaces(query)
  //     const placeArr = places.map(place => {
  //       return {
  //         place_id: place.place_id,
  //         name: place.name,
  //       }
  //     })
  //     return res.status(HttpStatus.OK).json({ results: placeArr })
  //   } catch (error) {
  //     console.error('Error fetching places:', error)
  //     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
  //       message: 'Error fetching places',
  //     })
  //   }
  // }

  @Get('/')
  async findByUserId(@Query('userId') userId: string, @Req() request: Request) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const item = await this.placeDomainFacade.findManyByUserId(
      userId,
      queryOptions,
    )
    return item
  }

  @Post()
  async createPlace(@Body() body: PlaceCreateDto, @Req() request: Request) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const item = await this.placeDomainFacade.create(body)

    await this.eventService.emit<PlaceApplicationEvent.PlaceCreated.Payload>(
      PlaceApplicationEvent.PlaceCreated.key,
      {
        id: item.id,
        userId: user.id,
      },
    )
    return item
  }
}
