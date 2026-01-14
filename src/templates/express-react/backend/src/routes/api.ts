import { Router } from 'express';
import { getItems, createItem } from '../controllers/itemController';

const router = Router();

router.get('/items', getItems);
router.post('/items', createItem);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;

