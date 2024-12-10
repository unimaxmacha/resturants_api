import { IsEmail, IsEmpty, IsEnum, IsOptional, IsPhoneNumber, IsString } from "class-validator"
import { Category } from "../schemas/resturant.schema"
import { User } from "../../auth/schemas/user.schema"

export class UpdateResturantDto {

    @IsString()
    @IsOptional()
    readonly name: string

    @IsString()
    @IsOptional()
    readonly description: string

    @IsEmail({}, {message: "Please enter correct email address."})
    @IsOptional()
    readonly email: string

    @IsPhoneNumber('US')
    @IsOptional()
    readonly phoneNo: number

    @IsString()
    @IsOptional()
    readonly address: string

    @IsEnum(Category, { message: "Please enter correct category."})
    @IsOptional()
    readonly category: Category

    @IsEmpty({ message: 'You cannot provide the user Id.'})
    readonly user: User;
}