import express from 'express';
import { executeCode } from '../controllers/code.controller.js';

const router = express.Router();

router.post('/execute', executeCode);

export default router;
