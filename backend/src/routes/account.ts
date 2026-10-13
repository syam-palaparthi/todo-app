import { Router } from 'express';
import { getAccount } from '../controllers/accountController';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();
router.get('/', verifyToken, getAccount);
export default router;