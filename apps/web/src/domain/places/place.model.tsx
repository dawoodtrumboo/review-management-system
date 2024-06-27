import { Review } from '../review'

export class Place {
  id: string
  place_id: string
  address: string
  name: string
  userId: string
}

export class ReviewList {
  name: string

  rating: number

  user_ratings_total: number

  reviews: Review[]
}
