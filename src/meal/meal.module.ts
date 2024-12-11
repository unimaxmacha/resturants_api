import { Module } from '@nestjs/common';
import { MealController } from './meal.controller';
import { MealService } from './meal.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MealSchema } from './schemas/meal.schema';
import { AuthModule } from '../auth/auth.module';
import { ResturantsModule } from '../resturants/resturants.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'Meal', schema: MealSchema }
    ]),
    ResturantsModule,
  ],
  controllers: [MealController],
  providers: [MealService]
})
export class MealModule {}
