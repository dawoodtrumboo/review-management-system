import { Location } from '../location'

import { History } from '../history'

export class Review {
  id?: string

  reviewText: string

  reviewDate: string

  status: string

  locationId: string

  location?: Location

  dateCreated: string

  dateDeleted: string

  dateUpdated: string

  replyId: string

  historys?: History[]

  // temp
  author_name: string

  time: number

  text: string

  place_id: string

  rating: number
}
