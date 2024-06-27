import { Review } from '@server/modules/review/domain'
import { User } from '@server/modules/user/domain'
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

  @Column({ nullable: true, unique: true })
  place_id?: string

  @Column({})
  name: string

  @Column({})
  address: string

  @Column({})
  userId: string

  @ManyToOne(() => User, user => user.place)
  @JoinColumn({ name: 'userId' })
  user?: User

  @OneToMany(() => Review, reviews => reviews.places)
  reviews?: Review[]

  @CreateDateColumn()
  dateCreated: string

  @DeleteDateColumn()
  dateDeleted: string
}
