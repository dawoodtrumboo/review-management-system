export class PlaceReview {
  name: string
  rating: number
  user_ratings_total: number
  reviews: Review[]
}

export class Review {
  author_name: string
  rating: number
  text: string
  time: number
}
