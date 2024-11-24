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
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth, GetUser, RoleProtected } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { FileUploadService } from 'src/common/services/file-upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    //@UploadedFiles() files: Express.Multer.File[],
    @GetUser() user: User,
  ) {
    //const uploadedUrls = await this.fileUploadService.uploadFiles(files);

    // const images = uploadedUrls.filter((url) => url.includes('image'));
    // const documents = uploadedUrls.filter((url) => url.includes('document'));

    // createPropertyDto.images = images;
    // createPropertyDto.documents = documents;

    return this.propertyService.create(createPropertyDto, user);
  }

  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query() filters: PropertyFilterDto,
  ) {
    return this.propertyService.findAll(page, limit, filters);
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
