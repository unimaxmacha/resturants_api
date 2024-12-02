import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Resturant } from './schemas/resturant.schema';
import * as mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';

@Injectable()
export class ResturantsService {
    constructor(
        @InjectModel(Resturant.name)
        private resturantModel: mongoose.Model<Resturant>
    ){}

    // Get all Resturants => Get /resturants
    async findAll(query: Query): Promise<Resturant[]> {

        const resPerPage = 2;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);
        
        const keyword = query.keyword ? {
            name: {
                $regex: query.keyword,
                $options: 'i'
            }
        }: {}

        const resturants = await this.resturantModel
            .find({ ...keyword })
            .limit(resPerPage)
            .skip(skip);
        return resturants;
    }

    // Create new Resturant => POST / resturants
    async create(resturant: Resturant): Promise<Resturant> {
        const res = await this.resturantModel.create(resturant)
        return res;
    }

    // Get a resturant by ID => Get /resturants/:id
    async findById(id: string): Promise<Resturant> {

        const resturant = await this.resturantModel.findById(id);

        if(!resturant) {
            throw new NotFoundException("Restaurant not found.");
        }

        return resturant;
    }

    // Update a resturant by ID = PUT /resturants/:id
    async updateById(id: string, resturant: Resturant): Promise<Resturant> {
        return await this.resturantModel.findByIdAndUpdate(id, resturant, {
            new: true,
            runValidators: true,
        });
    }

    // Delete a resturant by ID => DELETE /resturant/:id
    async deleteById(id: string): Promise<Resturant> {
        return await this.resturantModel.findByIdAndDelete(id);
    }
}
