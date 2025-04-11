
import { Document } from 'mongoose';

export interface User extends Document{
    _id: string;
    username: string;
    email: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// for user creation validation
export interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
}


// for user update validation
export interface UpdateUserRequest {
    username?: string;
    email?: string;
}

// for user response
export interface UserResponse {
    _id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
