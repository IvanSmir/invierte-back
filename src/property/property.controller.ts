import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Query,
  ParseUUIDPipe,
  DefaultValuePipe,
  ParseIntPipe,
  UploadedFile,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth, GetUser, RoleProtected } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { FileUploadService } from 'src/common/services/file-upload.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PropertyFilterDto } from './dto/property-filter.dto';

@ApiTags('Property')
@Controller('property')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @Auth()
  @ApiBearerAuth()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 10 },
      { name: 'documents', maxCount: 5 },
    ]),
    new (class {
      intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        if (req.body.createPropertyDto) {
          req.body = JSON.parse(req.body.createPropertyDto);
        }
        return next.handle();
      }
    })(),
  )
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
    @GetUser() user: User,
  ) {
    return this.propertyService.create(createPropertyDto, user, files);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query() filters?: Omit<PropertyFilterDto, 'page' | 'limit'>,
  ) {
    return this.propertyService.findAll(limit, page, filters);
  }
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) uuid: string) {
    return this.propertyService.findOne(uuid);
  }

  @Patch(':id')
  @Auth()
  @ApiBearerAuth()
  async update(
    @Param('id', ParseUUIDPipe) uuid: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertyService.update(uuid, updatePropertyDto);
  }
}
