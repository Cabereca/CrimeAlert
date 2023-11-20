import { Router } from 'express';
import { OcurrencyController } from '../controllers/ocurrencyController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/public', authMiddleware, OcurrencyController.index);
router.post('/', authMiddleware, OcurrencyController.create);
router.delete('/:id', authMiddleware, OcurrencyController.destroy);
router.get('/:userId', authMiddleware, OcurrencyController.userOcurrencies);
router.put('/:id', authMiddleware, OcurrencyController.update);

export default router;
