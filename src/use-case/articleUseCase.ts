import mongoose, { mongo } from "mongoose";
import { IArticleDocument } from "../models/article.model";
import appAssert from "../utils/appAssert";
import { BAD_REQUEST, NOT_FOUND } from "../constants/http";
import { IUserRepository } from "../interface/IUserRepository";
import { IArticleRepository } from "../interface/IArticleRepository";
import AppErrorCode from "../constants/appErrorCode";
import cloudinary from "../services/cloudinary";
import { ArticleQueryOptions } from "../types/articles.types";

export class ArticlesControllerUseCase {
    constructor(
        private readonly __articleRepository: IArticleRepository,
        private readonly __userRepository: IUserRepository

    ) { }


    async addPreferences(preferences: string[], userId: mongoose.Types.ObjectId) {
        appAssert(preferences.length > 0, BAD_REQUEST, "Preferences should not be empty");
        const user = await this.__userRepository.findUserById(userId);
        appAssert(user, BAD_REQUEST, "User not found");
        const updatedUser = await this.__userRepository.updateUserById(userId, { preferences });
        console.log(updatedUser, "updatedUser")
    };


    async getAllArticles() {
        const articles = await this.__articleRepository.getAllArticles();
        return articles;
    };

    async createArticle(id: mongoose.Types.ObjectId, article: Partial<IArticleDocument>) {
        const user = await this.__userRepository.findUserById(id);
        appAssert(user, NOT_FOUND, "User not found", AppErrorCode.UserNotFound);
        appAssert(user.isVerified, BAD_REQUEST, "User not verified");

        let uploadedImageUrl: string | undefined = undefined;
        if (article.imageUrl) {
            const uploadResponse = await cloudinary.uploader.upload(article.imageUrl);
            uploadedImageUrl = uploadResponse.secure_url;
        }

        const newArticleData = {
            ...article,
            author: id,
            imageUrl: uploadedImageUrl,
        };
        const newArticle = await this.__articleRepository.createArticle(id, newArticleData);
        appAssert(newArticle, BAD_REQUEST, "Article not created. Please try again later");

        return newArticle;
    }


    async getArticles(userId: mongoose.Types.ObjectId, options: ArticleQueryOptions): Promise<IArticleDocument[]> {
        return await this.__articleRepository.getArticlesByAuthorId(userId, options);
    }


    async updateArticle(userId: mongoose.Types.ObjectId, articleId: mongoose.Types.ObjectId, articleData: Partial<IArticleDocument>) {
        const user = await this.__userRepository.findUserById(userId);
        appAssert(user, NOT_FOUND, "User not found", AppErrorCode.UserNotFound);
        appAssert(user.isVerified, BAD_REQUEST, "User not verified");
        const updateArticle = await this.__articleRepository.updateArticle(userId, articleId, articleData);
        appAssert(updateArticle, BAD_REQUEST, "Article not updated. Please try again later");
        return updateArticle
    };

    async deleteArticle(userId: mongoose.Types.ObjectId, articleId: mongoose.Types.ObjectId) {
        const user = await this.__userRepository.findUserById(userId);
        appAssert(user, NOT_FOUND, "User not found", AppErrorCode.UserNotFound);
        appAssert(user.isVerified, BAD_REQUEST, "User not verified");
        await this.__articleRepository.deleteArticle(userId, articleId);
    };

    async likeArticle(userId: mongoose.Types.ObjectId, articleId: mongoose.Types.ObjectId) {
        const user = await this.__userRepository.findUserById(userId);
        appAssert(user, NOT_FOUND, "User not found", AppErrorCode.UserNotFound);
        appAssert(user.isVerified, BAD_REQUEST, "User not verified");
        const article = await this.__articleRepository.getArticleById(articleId);
        appAssert(article, NOT_FOUND, "Article not found.");
        await this.__articleRepository.likeArticle(userId, articleId)
    };
    async disLikeArticle(userId: mongoose.Types.ObjectId, articleId: mongoose.Types.ObjectId) {
        const user = await this.__userRepository.findUserById(userId);
        appAssert(user, NOT_FOUND, "User not found", AppErrorCode.UserNotFound);
        appAssert(user.isVerified, BAD_REQUEST, "User not verified");
        const article = await this.__articleRepository.getArticleById(articleId);
        appAssert(article, NOT_FOUND, "Article not found.");
        await this.__articleRepository.disLike(userId, articleId)
    };
}