import { Category } from "../schemas/resturant.schema"

export class UpdateResturantDto {
    readonly name: string
    readonly description: string
    readonly email: string
    readonly phoneNo: number
    readonly address: string
    readonly category: Category
}