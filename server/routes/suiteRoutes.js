import express from "express";
import { getAllSuites, getSuiteById, checkAvailability } from "../controllers/suiteController.js";

const router = express.Router();

router.get("/", getAllSuites);
router.get("/availability", checkAvailability);
router.get("/:id", getSuiteById);

export default router;
