import { 
    Body, 
    Controller, 
    Delete, 
    Get, Param, 
    Post, 
    Put, 
    Query,
    UseInterceptors,
    UploadedFiles,
    UseGuards,
} from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { ResturantsService } from './resturants.service';
import { Resturant } from './schemas/resturant.schema';
import { CreateResturantDto } from './dto/create-resturant.dto';
import { UpdateResturantDto } from './dto/update-resturant.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('resturants')
export class ResturantsController {
    constructor(private resturantsService: ResturantsService) {}

    @Get()
    @UseGuards(AuthGuard())
    async getAllResturants(@Query() query: ExpressQuery): Promise<Resturant[]> {
        return this.resturantsService.findAll(query);
    }

    @Post()
    async createResturant(
        @Body()
        resturant: CreateResturantDto,
    ): Promise<Resturant> {
        return this.resturantsService.create(resturant);
    }

    @Get(':id')
    async getResturant(
        @Param('id') 
        id: string
    ): Promise<Resturant> {
        return this.resturantsService.findById(id);
    }

    @Put(':id')
    async updateResturant(
        @Param('id') 
        id: string,
        @Body()
        resturant: UpdateResturantDto,
    ): Promise<Resturant> {
        await this.resturantsService.findById(id);

        return this.resturantsService.updateById(id, resturant);
    }

    @Delete(':id')
    async deleteResturant(
        @Param('id')
        id: string
    ): Promise<{ deleted: Boolean }> {
        await this.resturantsService.findById(id);

        const resturant = this.resturantsService.deleteById(id);

        if(resturant) {
            return {
                deleted: true,
            };
        }
    }

    @Post('upload/:id')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFiles(
        @Param('id') id: string,
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        console.log('Processing file upload...');
        if (!files || files.length === 0) {
        return {
            message: 'No files uploaded',
        };
        }

        const uploadedFiles = await this.resturantsService.uploadFiles(files);

        console.log('Uploaded Files:', uploadedFiles);

        return {
        uploadedFiles,
        };
    }
}
