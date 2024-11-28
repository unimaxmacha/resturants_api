import { Module } from '@nestjs/common';
import { ResturantsController } from './resturants.controller';
import { ResturantsService } from './resturants.service';

import { ResturantSchema } from './schemas/resturant.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Resturant', schema: ResturantSchema }
    ])
  ],
  controllers: [ResturantsController],
  providers: [ResturantsService]
})
export class ResturantsModule {}
