import { ArticlesController } from "../controllers/article-controller";
import { AuthController } from "../controllers/auth-controller";
import { ArticleRepository } from "../repository/ArticleRepository";
import { OtpRepository } from "../repository/OtpRepository";
import { SessionRepository } from "../repository/SessionRepository";
import { UserRepository } from "../repository/UserRepository";
import { ArticlesControllerUseCase } from "../use-case/articleUseCase";
import { AuthUseCase } from "../use-case/authUseCase";


export const initializeDependencies = () => {
    const userRepository = new UserRepository();
    const sessionRespository = new SessionRepository();
    const otpRepository = new OtpRepository();
    const articleRepository = new ArticleRepository();



    const authUseCase = new AuthUseCase(userRepository, otpRepository, sessionRespository);
    const articleUseCase = new ArticlesControllerUseCase(articleRepository, userRepository)



    const authController = new AuthController(authUseCase)
    const articleController = new ArticlesController(articleUseCase)


    return {
        authController,
        articleController
    };
};
