const nodeGeoCoder = require('node-geocoder');
import { JwtService } from "@nestjs/jwt";
import { Location } from "../resturants/schemas/resturant.schema";
import { v2 as cloudinary } from 'cloudinary';

export default class APIFeatures {
    static async getResturantLocation(address) {
        try {

            const options = {
                provider: process.env.GEOCODER_PROVIDER,
                httpAdapter: 'https',
                apiKey: process.env.GEOCODER_API_KEY,
                formatter: null,
            };

            const geoCoder = nodeGeoCoder(options);

            const loc = await geoCoder.geocode(address);

            const location: Location =  {
                type: 'Point',
                coordinates: [loc[0].longitude, loc[0].latitude],
                formattedAddress: loc[0].formattedAddress,
                city: loc[0].city,
                state: loc[0].stateCode,
                zipcode: loc[0].zipcode,
                country: loc[0].countryCode,
            };

            return location;

        } catch (error) {
            console.log(error.message);
            
        };
    };

    // Initialize Cloudinary
    static configureCloudinary() {
        cloudinary.config({
           cloud_name: process.env.COLUDINARY_CLOUD_NAME,
           api_key: process.env.COLUDINARY_API_KEY,
           api_secret: process.env.COLUDINARY_API_SECRET,
        });
    }

    // Upload images to Cloudinary
    static async upload(files) {
        if (!Array.isArray(files) || files.length === 0) {
            throw new Error('No files provided or files is not iterable.');
        }

        const images = [];
        for (const file of files) {
            const uploadResponse = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream (
                    { 
                        resource_type: 'auto', // Determine resource type automatically
                        folder: 'nestjsResturantAPI' // Upload to the "restaurant" folder
                    },
                    (error, result) => {
                        if (error) {
                            return reject (error);
                        }
                        resolve(result);
                    }
                );
                stream.end(file.buffer);
            });
            images.push(uploadResponse);
        }
        return images;
    }

    // Delete images from Cloudinary
    static async deleteImages(images) {
        if (images.length === 0) return true;

        const publicIds = images.map(image => image.public_id);

        const result = await cloudinary.api.delete_resources(publicIds);
        return result;
    }

    static async assignJwtToken(
        userId: string,
        jwtService: JwtService
    ): Promise<string> {

        const payload = { id: userId };

        const token = await jwtService.sign(payload);

        return token;
    }
}