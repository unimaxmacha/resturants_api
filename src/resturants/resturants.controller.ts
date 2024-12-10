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
    BadRequestException,
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
        const resturant = await this.resturantsService.findById(id);

        const isDeleted = await this.resturantsService.deleteImages(resturant.images);

        if(isDeleted) {
            this.resturantsService.deleteById(id);

            return {
                deleted: true,
            };
        } else {
            return {
                deleted: false,
            };
        }
    }

    @Put('upload/:id')
    @UseInterceptors(FilesInterceptor('files')) // 'files' must match the key in the form-data
    async uploadFiles(
        @Param('id') id : string,
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        if (!Array.isArray(files) || files.length === 0) {
            throw new BadRequestException('No files were uploaded.');
        }

        await this.resturantsService.findById(id);

        const res = await this.resturantsService.uploadImages(id, files);
        return res;
    }
}
