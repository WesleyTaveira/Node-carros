import { Router } from "express";
import carroController from "./carro.controller";

const router = Router();

router.use(carroController);

export default router;