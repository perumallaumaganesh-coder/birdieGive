import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// MIDDLEWARE
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// AUTH
router.post('/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, error: 'Email and password required' });
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ success: false, error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash } });
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
    res.json({ success: true, data: { user, token } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
    res.json({ success: true, data: { user, token } });
  } catch {
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// SCORES — max 5, 1 per day, 1-45 Stableford
router.get('/scores', authenticate, async (req: any, res) => {
  const scores = await prisma.score.findMany({
    where: { userId: req.user.userId },
    orderBy: { date: 'desc' },
  });
  res.json({ success: true, data: scores });
});

router.post('/scores', authenticate, async (req: any, res) => {
  const { points, date } = req.body;
  const userId = req.user.userId;

  if (!points || points < 1 || points > 45)
    return res.status(400).json({ success: false, error: 'Points must be between 1 and 45' });

  try {
    const existing = await prisma.score.findFirst({ where: { userId, date: new Date(date) } });
    if (existing)
      return res.status(400).json({ success: false, error: 'A score already exists for this date' });

    const allScores = await prisma.score.findMany({ where: { userId }, orderBy: { date: 'asc' } });
    if (allScores.length >= 5) {
      await prisma.score.delete({ where: { id: allScores[0].id } });
    }

    const newScore = await prisma.score.create({ data: { points, date: new Date(date), userId } });
    res.json({ success: true, data: newScore });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to add score' });
  }
});

// CHARITIES
router.get('/charities', async (_req, res) => {
  const charities = await prisma.charity.findMany({ orderBy: { createdAt: 'asc' } });
  res.json({ success: true, data: charities });
});

router.post('/charities', authenticate, async (req: any, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ success: false, error: 'Forbidden' });
  const { name, description, imageUrl } = req.body;
  if (!name || !description) return res.status(400).json({ success: false, error: 'Name and description required' });
  const charity = await prisma.charity.create({ data: { name, description, imageUrl } });
  res.json({ success: true, data: charity });
});

// ADMIN
router.get('/admin/users', authenticate, async (req: any, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ success: false, error: 'Forbidden' });
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, subscriptionStatus: true, charityId: true, charityPercentage: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: users });
});

export default router;
