import { Category } from "../schemas/resturant.schema"

export class CreateResturantDto {
    readonly name: string
    readonly description: string
    readonly email: string
    readonly phoneNo: number
    readonly address: string
    readonly category: Category
}