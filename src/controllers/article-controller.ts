import { Request, Response } from "express";
import { ArticlesControllerUseCase } from "../use-case/articleUseCase";
import catchErrors from "../utils/catchErrors";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { OK } from "../constants/http";
import { stringToObjectId } from "../utils/bcrypt";
import { preferencesSchema } from "../zod/preferences";
import { createArticleSchema } from "../zod/articles";



export class ArticlesController {

    constructor(private readonly __articleUseCase: ArticlesControllerUseCase) { }


    addPreferencesHandler = catchErrors(async (req: Request, res: Response) => {
        const { preferences } = preferencesSchema.parse(req.body);
        const { userId } = req as AuthenticatedRequest;
        await this.__articleUseCase.addPreferences(preferences, userId);
        return res.status(OK).json({
            success: true,
            message: "Preferences added successfully",
        })
    })

    getAllArticlesHandler = catchErrors(async (req: Request, res: Response) => {
        const articles = await this.__articleUseCase.getAllArticles();
        return res.status(OK).json({
            success: true,
            message: "Articles fetched successfully",
            data: articles
        })
    });

    createArticleHandler = catchErrors(async (req: Request, res: Response) => {
        const { userId: id } = req as AuthenticatedRequest;
        const validatedData = createArticleSchema.parse(req.body);
        const newArticle = await this.__articleUseCase.createArticle(id, validatedData);
        return res.status(OK).json({
            success: true,
            message: "Article created successfully",
            data: newArticle,
        });
    });

    getArticlesOfUserHandler = catchErrors(async (req: Request, res: Response) => {
        const id = stringToObjectId(req.params.id);
        const {
            search = "",
            sortBy = "createdAt",
            order = "desc",
            page = "1",
            limit = "10",
            category = ""
        } = req.query as {
            search?: string;
            sortBy?: string;
            order?: "asc" | "desc";
            page?: string;
            limit?: string;
            category?: string;
        };

        const queryOptions = {
            search,
            sortBy,
            order,
            page: parseInt(page),
            limit: parseInt(limit),
            category
        };

        const articles = await this.__articleUseCase.getArticles(id, queryOptions);

        return res.status(OK).json({
            success: true,
            message: "Articles fetched successfully",
            data: articles
        });
    });


    editArticleHandler = catchErrors(async (req: Request, res: Response) => {
        console.log(req.body)
        const { userId } = req as AuthenticatedRequest;
        const articleId = stringToObjectId(req.body.id);
        const articleData = req.body.articleData;
        const updatedArticle = await this.__articleUseCase.updateArticle(userId, articleId, articleData);
        return res.status(OK).json({
            success: true,
            message: "Article updated successfully",
            data: updatedArticle
        })
    });

    deleteArticleHandler = catchErrors(async (req: Request, res: Response) => {
        const { userId } = req as AuthenticatedRequest;
        const articleId = stringToObjectId(req.params.id);
        await this.__articleUseCase.deleteArticle(userId, articleId);
        return res.status(OK).json({
            success: true,
            message: "Article deleted successfully",
        });
    });



    likeArticleHanlder = catchErrors(async (req: Request, res: Response) => {
        const { userId } = req as AuthenticatedRequest;
        console.log("Req body : ", req.body)
        const articleId = stringToObjectId(req.body.articleId);
        await this.__articleUseCase.likeArticle(userId, articleId)
        return res.status(OK).json({
            success: true,
            message: "Successfully liked the post"
        })
    });

    disLikeArticleHandler = catchErrors(async (req: Request, res: Response) => {
        const { userId } = req as AuthenticatedRequest;
        const articleId = stringToObjectId(req.body.articleId);
        await this.__articleUseCase.disLikeArticle(userId, articleId)
        return res.status(OK).json({
            success: true,
            message: "Successfully liked the post"
        })

    })


}