import { BusinessPlace } from '@server/modules/businessPlaces/domain'
import { Review } from '@server/modules/review/domain'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({})
  name: string

  @Column({})
  address: string

  @Column({})
  business_place_id: string

  @ManyToOne(() => BusinessPlace, business => business.places)
  @JoinColumn({ name: 'business_place_id' })
  business_place?: BusinessPlace

  @OneToMany(() => Review, reviews => reviews.places)
  reviews?: Review[]

  @CreateDateColumn()
  dateCreated: string

  @DeleteDateColumn()
  dateDeleted: string
}
