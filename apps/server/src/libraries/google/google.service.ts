import { Injectable } from '@nestjs/common'
import { Review } from '@server/modules/review/domain'
import axios, { AxiosResponse } from 'axios'
import { OAuth2Client } from 'google-auth-library'
import { ConfigurationService } from '../../core/configuration'
import { Logger, LoggerService } from '../logger'

@Injectable()
export class GoogleService {
  private logger: Logger
  private readonly baseUrl =
    'https://maps.googleapis.com/maps/api/place/details/json'

  client: OAuth2Client

  private clientId: string

  constructor(
    private configurationService: ConfigurationService,
    private loggerService: LoggerService,
  ) {
    this.logger = this.loggerService.create({ name: 'GoogleService' })

    try {
      this.clientId = this.configurationService.get('SERVER_GOOGLE_CLIENT_ID')

      if (!this.clientId) {
        this.logger.warning(
          `Set GOOGLE_CLIENT_ID in your .env to activate Google Auth`,
        )
        return
      }

      this.client = new OAuth2Client(this.clientId)

      this.logger.success(`Google Oauth active`)
    } catch (error) {
      this.logger.error(`Could not start Google Oauth`)
      this.logger.error(error)
    }
  }

  async verifyToken(token: string): Promise<any> {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: this.clientId,
    })
    const { name, email } = ticket.getPayload()

    return {
      name,
      email,
    }
  }

  async findPlaceDetails(
    place_id: string,
    fields: string,
  ): Promise<{
    name: string
    rating: number
    user_ratings_total: number
    reviews: Review[]
  }> {
    const url = new URL(this.baseUrl)
    const apiKey = this.configurationService.get('SERVER_GOOGLE_CLIENT_API_KEY')
    url.searchParams.append('key', apiKey)
    url.searchParams.append('place_id', place_id)
    url.searchParams.append('fields', fields)

    try {
      const response: AxiosResponse<{
        result: {
          name: string
          rating: number
          user_ratings_total: number
          reviews: Review[]
        }
        status: string
      }> = await axios.get(url.toString())

      if (response.data.status === 'OK') {
        return response.data.result
      } else {
        throw new Error(`Error fetching places:${response.data.status}`)
      }
    } catch (error) {
      console.error('Error fetching places', error)
      throw error
    }
  }
}
