const nodeGeoCoder = require('node-geocoder');
import { S3 } from "aws-sdk";
import { Location } from "../resturants/schemas/resturant.schema";
import { Body } from "@nestjs/common";
import { resolve } from "path";

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

    // Upload images
    static async upload(files) {
        return new Promise((resolve, reject) => {

            const s3 = new S3 ({
                accessKeyId: process.env.COLUDINARY_API_KEY,
                secretAccessKey: process.env.COLUDINARY_API_SECRET,
            });

            let images = [];

            files.forEach(async (file) => {
                const splitFile = file.originalname.split('.');
                const random = Date.now();

                const fileName = `${splitFile[0]}_${random}.${splitFile[1]}`;

                const params = {
                    Bucket: `${process.env.COLUDINARY_CLOUD_NAME}/nestjsResturantAPI`,
                    Key: fileName,
                    Body: file.buffer,
                };

                const uploadResponse = await s3.upload(params).promise();

                images.push(uploadResponse);

                if(images.length === files.length) {
                    resolve(images);
                }
            });
        });
    }

    // Delete images
    static async deleteImages(images) {
        const s3 = new S3 ({
            accessKeyId: process.env.COLUDINARY_API_KEY,
            secretAccessKey: process.env.COLUDINARY_API_SECRET,
        });

        let imagesKeys = images.map((image) => {
            return {
                Key: image.Key
            }
        });

        const params = {
            Bucket: `${process.env.COLUDINARY_CLOUD_NAME}`,
            Delete: {
                Objects: imagesKeys,
                Quiet: false,
            }
        };

        return new Promise((resolve, reject) => {
            s3.deleteObjects(params, function(err, data) {
                if(err) {
                    console.log(err);
                    reject(false)
                } else {
                    resolve(true)
                }
            });
        });
    }
}