import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signup.dto';

import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import APIFeatures from 'src/utils/apiFeatures.utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService,
    ) {}

    // Register User
    async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
        const { name, email, password } = signUpDto;

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await this.userModel.create({
                name,
                email,
                password: hashedPassword,
            });

            const token = await APIFeatures.assignJwtToken(user._id, this.jwtService)

            return { token };

        } catch (error) {
            // Handle duplicate email
            if(error.code === 11000) {
                throw new ConflictException('Duplicate Email entered.');
            }
        }
    }

    // Login user
    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = loginDto;

        const user = await this.userModel.findOne({ email }).select('+password');

        if(!user) {
            throw new UnauthorizedException('Invalid email or password.');
        }

        // Check if password is correct or not
        const isPasswordmatched = await bcrypt.compare(password, user.password)
        if(!isPasswordmatched) {
            throw new UnauthorizedException('Invalid email or password.');
        }

        const token = await APIFeatures.assignJwtToken(user._id, this.jwtService)

        return { token };
    }
}
