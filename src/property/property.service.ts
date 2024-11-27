import { Inject, Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HandleDbErrorService } from 'src/common/services/handle-db-error.service';
import { Prisma, User } from '@prisma/client';
import { PropertyFilterDto } from './dto/property-filter.dto';
import { FileUploadService } from 'src/common/services/file-upload.service';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

@Injectable()
export class PropertyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly handleDbError: HandleDbErrorService,
    private readonly fileUploadService: FileUploadService,
    @Inject('FIREBASE_STORAGE') private readonly storage: any,
  ) {}

  async create(
    createPropertyDto: CreatePropertyDto,
    user: User,
    files: {
      images?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
  ) {
    try {
      const uploadedFiles = await this.fileUploadService.uploadFiles(files);

      const property = await this.prisma.property.create({
        data: {
          userId: user.id,
          name: createPropertyDto.name,
          description: createPropertyDto.description,
          price: createPropertyDto.price,
          size: createPropertyDto.size,
          type: createPropertyDto.type,
          location: createPropertyDto.location,
          coordinates: createPropertyDto.coordinates,
          propertyNumber: createPropertyDto.propertyNumber,
          registryInfo: createPropertyDto.registryInfo,
          address: createPropertyDto.address,
          departmentId: createPropertyDto.departmentId,
          cityId: createPropertyDto.cityId,
          neighborhoodId: createPropertyDto.neighborhoodId,
          images: {
            createMany: {
              data: uploadedFiles.images.map((image) => ({
                url: image.url,
              })),
            },
          },
          documents: {
            createMany: {
              data: uploadedFiles.documents.map((doc) => ({
                name: doc.name,
                url: doc.url,
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
      const whereClause = {
        ...(filters.departmentId && { departmentId: filters.departmentId }),
        ...(filters.cityId && { cityId: filters.cityId }),
        ...(filters.neighborhoodId && {
          neighborhoodId: filters.neighborhoodId,
        }),
      };
      const properties = await this.prisma.property.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          size: true,
          type: true,
          location: true,
          coordinates: true,
          departmentId: true,
          cityId: true,
          neighborhoodId: true,
          images: true,
        },
        where: whereClause,
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
    } catch (error) {
      throw this.handleDbError.handleDbError(error, 'Property', 'update');
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const storageRef = ref(this.storage, `test-uploads/${fileName}`);

    try {
      await uploadBytes(storageRef, file.buffer);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('File upload failed');
    }
  }

  async testUpload(): Promise<string> {
    const testFile = Buffer.from('This is a test file content');
    const fileName = `test-file-${Date.now()}.txt`;
    const storageRef = ref(this.storage, `test-uploads/${fileName}`);

    try {
      await uploadBytes(storageRef, testFile);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error in test upload:', error);
      throw new Error('Test upload failed');
    }
  }
}
