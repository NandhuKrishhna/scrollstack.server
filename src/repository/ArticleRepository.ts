import mongoose from "mongoose";
import ArticleModel, { IArticleDocument } from "../models/article.model";
import { IArticleRepository } from "../interface/IArticleRepository";
import appAssert from "../utils/appAssert";
import { NOT_FOUND } from "../constants/http";

export class ArticleRepository implements IArticleRepository {

    async createArticle(id: mongoose.Types.ObjectId, article: Partial<IArticleDocument>): Promise<IArticleDocument> {
        const newArticle = await ArticleModel.create({ ...article, author: id });
        return newArticle
    }
    async getAllArticles(): Promise<IArticleDocument[]> {
        return await ArticleModel.find().lean().exec();
    };

    async getArticleById(id: mongoose.Types.ObjectId): Promise<IArticleDocument | null> {
        return await ArticleModel.findById(id).lean().exec();
    };

    async updateArticle(userId: mongoose.Types.ObjectId, articleId: mongoose.Types.ObjectId, articleData: Partial<IArticleDocument>): Promise<IArticleDocument | null> {
        return await ArticleModel.findOneAndUpdate({ _id: articleId, author: userId }, { ...articleData }, { new: true }).lean().exec();
    };


    async deleteArticle(userId: mongoose.Types.ObjectId, articleId: mongoose.Types.ObjectId): Promise<void> {
        await ArticleModel.findOneAndDelete({ _id: articleId, author: userId }).lean().exec();
    };

    async likeArticle(id: mongoose.Types.ObjectId, articleId: mongoose.Types.ObjectId): Promise<void> {
        const article = await ArticleModel.findOne({ _id: articleId });
        appAssert(article, NOT_FOUND, "Article not found. Please check again.");
        const hasLiked = article.likedBy.includes(id);
        if (hasLiked) {
            await ArticleModel.findByIdAndUpdate(
                articleId,
                {
                    $pull: { likedBy: id },
                    $inc: { likes: -1 }
                },
                { new: true }
            ).lean().exec();
        } else {
            await ArticleModel.findByIdAndUpdate(
                articleId,
                {
                    $addToSet: { likedBy: id },
                    $inc: { likes: 1 }
                },
                { new: true }
            ).lean().exec();
        }
    };

    async getArticlesByAuthorId(userId: mongoose.Types.ObjectId): Promise<IArticleDocument[] | null> {
        return await ArticleModel.find({ author: userId }).lean().exec();
    };







}