import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class Place {
  place_id: string
  name: string
  // address:string
  // userId:string
}

export class Reviews {
  rating: number
  text: string
  author: string
  date: string
}

export class PlaceCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  place_id: string

  @IsString()
  @IsNotEmpty()
  address: string

  @IsString()
  userId?: string

  @IsString()
  @IsOptional()
  dateCreated?: string

  @IsString()
  @IsOptional()
  dateDeleted?: string

  @IsString()
  @IsOptional()
  dateUpdated?: string
}
