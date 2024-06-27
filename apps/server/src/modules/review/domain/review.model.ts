import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Location } from '../../../modules/location/domain'

import { Reply } from '../../../modules/reply/domain'

import { Place } from '@server/modules/place/domain'
import { History } from '../../../modules/history/domain'

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({})
  reviewText: string

  @Column({})
  reviewDate: string

  @Column({ nullable: true })
  status?: string

  @Column({ nullable: true })
  locationId: string

  @ManyToOne(() => Location, parent => parent.reviews)
  @JoinColumn({ name: 'locationId' })
  location?: Location

  // @OneToMany(() => Reply, child => child.review)
  // replys?: Reply[]
  @Column({ nullable: true })
  replyId: string

  @OneToOne(() => Reply, child => child.review)
  @JoinColumn({ name: 'replyId' })
  reply?: Reply

  @OneToMany(() => History, child => child.review)
  historys?: History[]

  @CreateDateColumn()
  dateCreated: string

  @UpdateDateColumn()
  dateUpdated: string

  @DeleteDateColumn()
  dateDeleted: string

  // Temp relations

  @Column({ nullable: true })
  author_name?: string

  @Column({ nullable: true })
  rating?: number

  @Column({ nullable: true })
  time?: number

  @Column({ nullable: true })
  place_id: string

  @ManyToOne(() => Place, places => places.reviews)
  @JoinColumn({ name: 'place_id', referencedColumnName: 'place_id' })
  places?: Place
}
