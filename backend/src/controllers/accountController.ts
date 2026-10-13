import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { AccountModel } from '../models/account';

export const getAccount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await AccountModel.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.json({ user });
  } catch (err) {
    console.error('Get account error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};