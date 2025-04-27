import { Router } from 'express';
import { initializeDependencies } from '../config/dp';



const articleRouter = Router();
const { articleController } = initializeDependencies();

articleRouter.post("/create-article", articleController.createArticleHandler);
articleRouter.post("/add-preference", articleController.addPreferencesHandler);
articleRouter.get("/get-all-articles", articleController.getAllArticlesHandler);
articleRouter.get("/get-articles/:id", articleController.getArticlesOfUserHandler);
articleRouter.patch("/edit-article", articleController.editArticleHandler);
articleRouter.delete("/delete-article", articleController.deleteArticleHandler);
articleRouter.post("/like-article", articleController.likeArticleHanlder);