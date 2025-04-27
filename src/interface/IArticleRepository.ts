import mongoose from "mongoose";
import { IArticleDocument } from "../models/article.model";

export interface IArticleRepository {
    createArticle(id: mongoose.Types.ObjectId, article: Partial<IArticleDocument>): Promise<IArticleDocument>;
    getAllArticles(): Promise<IArticleDocument[]>;
    getArticleById(id: mongoose.Types.ObjectId): Promise<IArticleDocument | null>;
    updateArticle(userId: mongoose.Types.ObjectId, articleId: mongoose.Types.ObjectId, articleData: Partial<IArticleDocument>): Promise<IArticleDocument | null>;
    deleteArticle(userId: mongoose.Types.ObjectId, articleId: mongoose.Types.ObjectId): Promise<void>;
    likeArticle(id: mongoose.Types.ObjectId, articleId: mongoose.Types.ObjectId): Promise<void>
    getArticlesByAuthorId(userId: mongoose.Types.ObjectId): Promise<IArticleDocument[] | null>;

}