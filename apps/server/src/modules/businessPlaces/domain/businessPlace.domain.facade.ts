import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DatabaseHelper } from '../../../core/database'
import { RequestHelper } from '../../../helpers/request'
import { BusinessPlace } from './buisinessPlace.model'

import { Location } from '../../location/domain'

@Injectable()
export class BusinessPlaceDomainFacade {
  constructor(
    @InjectRepository(BusinessPlace)
    private repository: Repository<BusinessPlace>,
    private databaseHelper: DatabaseHelper,
  ) {}

  async create(values: Partial<BusinessPlace>): Promise<BusinessPlace> {
    return this.repository.save(values)
  }

  async update(
    item: BusinessPlace,
    values: Partial<BusinessPlace>,
  ): Promise<BusinessPlace> {
    const itemUpdated = { ...item, ...values }

    return this.repository.save(itemUpdated)
  }

  async delete(item: BusinessPlace): Promise<void> {
    await this.repository.softDelete(item.id)
  }

  async findMany(
    queryOptions: RequestHelper.QueryOptions<BusinessPlace> = {},
  ): Promise<BusinessPlace[]> {
    const query = this.databaseHelper.applyQueryOptions(
      this.repository,
      queryOptions,
    )

    return query.getMany()
  }

  async findOneByIdOrFail(
    id: string,
    queryOptions: RequestHelper.QueryOptions<BusinessPlace> = {},
  ): Promise<BusinessPlace> {
    if (!id) {
      this.databaseHelper.invalidQueryWhere('id')
    }

    const queryOptionsEnsured = {
      includes: queryOptions?.includes,
      filters: {
        id: id,
      },
    }

    const query = this.databaseHelper.applyQueryOptions(
      this.repository,
      queryOptionsEnsured,
    )

    const item = await query.getOne()

    if (!item) {
      this.databaseHelper.notFoundByQuery(queryOptionsEnsured.filters)
    }

    return item
  }

  async findManyByLocation(
    item: Location,
    queryOptions: RequestHelper.QueryOptions<BusinessPlace> = {},
  ): Promise<BusinessPlace[]> {
    if (!item) {
      this.databaseHelper.invalidQueryWhere('location')
    }

    const queryOptionsEnsured = {
      includes: queryOptions.includes,
      orders: queryOptions.orders,
      filters: {
        ...queryOptions.filters,
        locationId: item.id,
      },
    }

    const query = this.databaseHelper.applyQueryOptions(
      this.repository,
      queryOptionsEnsured,
    )

    return query.getMany()
  }
}
