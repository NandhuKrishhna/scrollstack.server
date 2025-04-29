import { Router } from 'express';
import { initializeDependencies } from '../config/dp';



const articleRouter = Router();
const { articleController, authController } = initializeDependencies();

articleRouter.post("/create-article", articleController.createArticleHandler);
articleRouter.post("/add-preference", articleController.addPreferencesHandler);
articleRouter.get("/get-all-articles", articleController.getAllArticlesHandler);
articleRouter.get("/get-articles/:id", articleController.getArticlesOfUserHandler);
articleRouter.patch("/edit-article", articleController.editArticleHandler);
articleRouter.delete("/delete-article/:id", articleController.deleteArticleHandler);
articleRouter.post("/like-article", articleController.likeArticleHanlder);
articleRouter.post("/disLike-article", articleController.disLikeArticleHandler);
articleRouter.post("/change-password", authController.updatePasswordHandler);
articleRouter.post("/update-profile", authController.updateProfileHandler);

export default articleRouter;