import { Router } from "express";
import carroController from "./carro.controller";
import marcaController from "./marca.controller";

const router = Router();

router.use(carroController);
router.use(marcaController);

export default router;