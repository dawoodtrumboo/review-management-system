export class Place {
  place_id: string

  name: string
}

export class ReviewList {
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

  id: string

  reviewDate: string

  profile_photo_url: string
}
