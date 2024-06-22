import { Place } from '@server/modules/place/domain'
import { User } from '@server/modules/user/domain'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class BusinessPlace {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({})
  name: string

  @Column({})
  address: string

  @Column({})
  userId: string

  @OneToOne(() => User, user => user.business)
  @JoinColumn({ name: 'userId' })
  user?: User

  @OneToMany(() => Place, place => place.business_place)
  places?: Place[]

  @CreateDateColumn()
  dateCreated: string

  @UpdateDateColumn()
  dateUpdated: string

  @DeleteDateColumn()
  dateDeleted: string
}
