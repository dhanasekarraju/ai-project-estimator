import { Router } from 'express';
import { estimateProject } from '../controllers/estimateController';

const router = Router();

router.post("/estimate", estimateProject);

router.get("/test", (req, res) => {
    res.json({ message: "API is working!" });
});


export default router;