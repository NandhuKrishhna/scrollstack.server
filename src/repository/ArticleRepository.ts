import mongoose from "mongoose";
import ArticleModel, { IArticleDocument } from "../models/article.model";
import { IArticleRepository } from "../interface/IArticleRepository";
import appAssert from "../utils/appAssert";
import { NOT_FOUND } from "../constants/http";
import { IArticleDocumentResponse } from "../types/user";

export class ArticleRepository implements IArticleRepository {

    async createArticle(id: mongoose.Types.ObjectId, article: Partial<IArticleDocument>): Promise<IArticleDocument> {
        const newArticle = await ArticleModel.create({ ...article, author: id });
        return newArticle
    }
    async getAllArticles(): Promise<IArticleDocumentResponse[]> {
        const articles = await ArticleModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author",
                }
            },
            {
                $unwind: "$author"
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    content: 1,
                    category: 1,
                    imageUrl: 1,
                    tags: 1,
                    status: 1,
                    likes: 1,
                    likedBy: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    author: {
                        _id: "$author._id",
                        name: "$author.name",
                        profilePicture: "$author.profilePicture"
                    }
                }
            }
        ]);

        return articles as IArticleDocumentResponse[];
    }




    async getArticleById(id: mongoose.Types.ObjectId): Promise<IArticleDocument | null> {
        return await ArticleModel.findById(id).lean().exec();
    };

    async updateArticle(userId: mongoose.Types.ObjectId, articleId: mongoose.Types.ObjectId, articleData: Partial<IArticleDocument>): Promise<IArticleDocument | null> {
        return await ArticleModel.findOneAndUpdate({ _id: articleId, author: userId }, { ...articleData }, { new: true }).lean().exec();
    };


    async deleteArticle(userId: mongoose.Types.ObjectId, articleId: mongoose.Types.ObjectId): Promise<void> {
        await ArticleModel.findOneAndDelete({ _id: articleId, author: userId }).lean().exec();
    };

    async disLike(id: mongoose.Types.ObjectId, articleId: mongoose.Types.ObjectId): Promise<void> {
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
        }
    };


    async getArticlesByAuthorId(userId: mongoose.Types.ObjectId): Promise<IArticleDocument[] | null> {
        return await ArticleModel.find({ author: userId }).lean().exec();
    };

    async likeArticle(id: mongoose.Types.ObjectId, articleId: mongoose.Types.ObjectId): Promise<void> {
        const article = await ArticleModel.findOne({ _id: articleId });
        appAssert(article, NOT_FOUND, "Article not found. Please check again.");
        const hasLiked = article.likedBy.includes(id);
        if (!hasLiked) {
            await ArticleModel.findByIdAndUpdate(
                articleId,
                {
                    $addToSet: { likedBy: id },
                    $inc: { likes: 1 }
                },
                { new: true }
            ).lean().exec();
        }
    }







}