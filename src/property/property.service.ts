import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HandleDbErrorService } from 'src/common/services/handle-db-error.service';
import { Prisma, User } from '@prisma/client';
import { PropertyFilterDto } from './dto/property-filter.dto';

@Injectable()
export class PropertyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly handleDbError: HandleDbErrorService,
  ) {}

  async create(createPropertyDto: CreatePropertyDto, user: User) {
    try {
      const property = await this.prisma.property.create({
        data: {
          userId: user.id,
          name: createPropertyDto.name,
          description: createPropertyDto.description,
          price: createPropertyDto.price,
          size: createPropertyDto.size,
          type: createPropertyDto.type,
          location: createPropertyDto.location,
          latitude: createPropertyDto.latitude,
          longitude: createPropertyDto.longitude,
          propertyNumber: createPropertyDto.propertyNumber,
          registryInfo: createPropertyDto.registryInfo,
          address: createPropertyDto.address,
          departmentId: createPropertyDto.departmentId,
          cityId: createPropertyDto.cityId,
          neighborhoodId: createPropertyDto.neighborhoodId,
          images: {
            createMany: {
              data: createPropertyDto.images.map((url) => ({
                url,
              })),
            },
          },
          documents: {
            createMany: {
              data: createPropertyDto.documents.map((doc) => ({
                name: doc,
                url: doc,
              })),
            },
          },
          lots: {
            createMany: {
              data: createPropertyDto.lots.map((lot) => ({
                number: lot.number,
                area: lot.area,
                price: lot.price,
                status: lot.status,
                coordinates: lot.coordinates,
              })),
            },
          },
        },
        include: {
          lots: true,
          images: true,
          documents: true,
        },
      });

      return property;
    } catch (error) {
      throw this.handleDbError.handleDbError(error, 'Property', 'create');
    }
  }

  async findAll(limit: number, page: number, filters: PropertyFilterDto) {
    try {
      const properties = await this.prisma.property.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          size: true,
          type: true,
          location: true,
          latitude: true,
          longitude: true,
          departmentId: true,
          cityId: true,
          neighborhoodId: true,
          images: true,
        },
        where: {
          AND: [
            {
              departmentId: filters.departmentId
                ? filters.departmentId
                : undefined,
            },
            {
              cityId: filters.cityId ? filters.cityId : undefined,
            },
            {
              neighborhoodId: filters.neighborhoodId
                ? filters.neighborhoodId
                : undefined,
            },
          ],
        },
        skip: (page - 1) * limit,
        take: limit,
      });
      const total = await this.prisma.property.count();
      return {
        properties,
        meta: {
          total,
          page,
          limit,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.handleDbError.handleDbError(error, 'Property', 'findAll');
    }
  }

  async findOne(uuid: string) {
    try {
      const property = await this.prisma.property.findUnique({
        where: { id: uuid },
        include: {
          lots: true,
          images: true,
          documents: true,
        },
      });

      if (!property) {
        throw new Error(`Property with UUID ${uuid} not found`);
      }

      return property;
    } catch (error) {
      throw this.handleDbError.handleDbError(error, 'Property', 'findOne');
    }
  }

  async update(uuid: string, updatePropertyDto: UpdatePropertyDto) {
    try {
      const property = await this.prisma.property.update({
        where: { id: uuid },
        data: {
          name: updatePropertyDto.name ?? Prisma.skip,
          description: updatePropertyDto.description ?? Prisma.skip,
          price: updatePropertyDto.price ?? Prisma.skip,
          size: updatePropertyDto.size ?? Prisma.skip,
          type: updatePropertyDto.type ?? Prisma.skip,
          location: updatePropertyDto.location ?? Prisma.skip,
          latitude: updatePropertyDto.latitude ?? Prisma.skip,
          longitude: updatePropertyDto.longitude ?? Prisma.skip,
          propertyNumber: updatePropertyDto.propertyNumber ?? Prisma.skip,
          registryInfo: updatePropertyDto.registryInfo ?? Prisma.skip,
          address: updatePropertyDto.address ?? Prisma.skip,
          departmentId: updatePropertyDto.departmentId ?? Prisma.skip,
          cityId: updatePropertyDto.cityId ?? Prisma.skip,
          neighborhoodId: updatePropertyDto.neighborhoodId ?? Prisma.skip,
          images: updatePropertyDto.images
            ? {
                deleteMany: {},
                createMany: {
                  data: updatePropertyDto.images.map((url) => ({
                    url,
                  })),
                },
              }
            : Prisma.skip,
          documents: updatePropertyDto.documents
            ? {
                deleteMany: {},
                createMany: {
                  data: updatePropertyDto.documents.map((doc) => ({
                    name: doc,
                    url: doc,
                  })),
                },
              }
            : Prisma.skip,
          lots: updatePropertyDto.lots
            ? {
                deleteMany: {}, // Borra todos los lotes existentes
                createMany: {
                  data: updatePropertyDto.lots.map((lot) => ({
                    number: lot.number,
                    area: lot.area,
                    price: lot.price,
                    status: lot.status,
                    coordinates: lot.coordinates,
                  })),
                },
              }
            : Prisma.skip,
        },
        include: {
          lots: true,
          images: true,
          documents: true,
        },
      });

      return property;
    } catch (error) {
      throw this.handleDbError.handleDbError(error, 'Property', 'update');
    }
  }
}
