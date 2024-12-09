import { v2 as cloudinary } from 'cloudinary';
const nodeGeoCoder = require('node-geocoder');
import { Location } from "../resturants/schemas/resturant.schema";
import { BadRequestException } from '@nestjs/common';

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

    // Configure Cloudinary with credentials from the environment variables.
    static configureCloudinary() {
        cloudinary.config({
            cloud_name: process.env.COLUDINARY_CLOUD_NAME,
            api_key: process.env.COLUDINARY_API_KEY,
            api_secret: process.env.COLUDINARY_API_SECRET,
        });
    }

    static async uploadFileToCloudinary(fileBuffer: Buffer) {
        try {
            console.log('Uploading buffer to Cloudinary...');
            return new Promise((resolve, reject) => {
                const result = cloudinary.uploader.upload_stream(
                    {
                        folder: 'nestjsResturantAPI',
                    },
                    (error, uploadResult) => {
                        if (error) {
                            console.error('Error uploading to Cloudinary', error);
                            return reject(error);
                        }
                        console.log('Upload successful:', uploadResult);
                        resolve({
                            url: uploadResult?.secure_url,
                            public_id: uploadResult?.public_id,
                        });
                    },
                );
    
                result.end(fileBuffer);
            });
        } catch (error) {
            console.error('Unexpected error while uploading to Cloudinary:', error);
            throw new BadRequestException('Unexpected upload error');
        }
    }
}