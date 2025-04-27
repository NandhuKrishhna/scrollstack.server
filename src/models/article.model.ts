import mongoose, { Schema, Document } from 'mongoose';

export enum Category {
    Sports = 'Sports',
    Politics = 'Politics',
    Space = 'Space',
    Technology = 'Technology',
    Health = 'Health',
    Education = 'Education',
    Entertainment = 'Entertainment',
    Other = 'Other',
}

export enum ArticleStatus {
    Draft = 'Draft',
    Published = 'Published',
    Archived = 'Archived',
}

export interface IArticleDocument extends Document {
    title: string;
    description?: string;
    content: string;
    category: Category;
    author: mongoose.Types.ObjectId;
    imageUrl?: string;
    tags?: string[];
    status: ArticleStatus;
    likes: number;
    likedBy: mongoose.Types.ObjectId[],
}

const ArticleSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: false,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: Object.values(Category),
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        imageUrl: {
            type: String,
            trim: true,
        },
        tags: {
            type: [String],
            required: false,
            validate: [(val: string[]) => val.length > 0, 'At least one tag is required.'],
        },
        status: {
            type: String,
            enum: Object.values(ArticleStatus),
            default: ArticleStatus.Draft,
        },
        likes: {
            type: Number,
            default: 0,
        },
        likedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
    },
    {
        timestamps: true,
    }
);

ArticleSchema.index({ title: 'text', description: 'text', content: 'text' });

const ArticleModel = mongoose.model<IArticleDocument>('Article', ArticleSchema);

export default ArticleModel;
