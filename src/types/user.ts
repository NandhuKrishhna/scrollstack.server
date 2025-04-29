import mongoose from "mongoose";
import { Category } from "../utils/article.enum";
import { ArticleStatus } from "../models/article.model";

export interface IUser {
    name: string;
    email: string;
    password: string;
}


export interface IOtp {
    code: string;
    userId: mongoose.Types.ObjectId;
    expiresAt: Date;
}
export interface ILoginUserParams {
    email: string;
    password: string;
};

export interface IArticleAuthorResponse {
    _id: string;
    name: string;
    profilePicture: string;
}

export interface IArticleDocumentResponse {
    _id: string;
    title: string;
    description?: string;
    content: string;
    category: string;
    author: IArticleAuthorResponse;
    imageUrl?: string;
    tags?: string[];
    status: string;
    likes: number;
    likedBy: string[];
    createdAt: string;
    updatedAt: string;
}
