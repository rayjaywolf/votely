import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const router = Router();

const createPollSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
});

const voteSchema = z.object({
  optionId: z.string(),
});


router.post('/', async (req, res) => {
  try {
    const { question, options } = createPollSchema.parse(req.body);

    const poll = await prisma.poll.create({
      data: {
        question,
        options: {
          create: options.map(text => ({ text })),
        },
      },
      include: {
        options: true,
      },
    });

    res.json(poll);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create poll' });
    }
  }
});


router.get('/', async (req, res) => {
  try {
    const polls = await prisma.poll.findMany({
      include: {
        options: true,
      },
    });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch polls' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const poll = await prisma.poll.findUnique({
      where: { id: req.params.id },
      include: {
        options: {
          orderBy: { id: 'asc' }
        },
      },
    });

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    res.json(poll);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch poll' });
  }
});

// Vote on a poll option
router.post('/:id/vote', async (req, res) => {
  try {
    const { id: pollId } = req.params;
    const { optionId } = voteSchema.parse(req.body);

    // First verify that the option belongs to this poll
    const option = await prisma.option.findFirst({
      where: {
        id: optionId,
        pollId: pollId,
      },
    });

    if (!option) {
      return res.status(404).json({ error: 'Option not found for this poll' });
    }

    // Update the vote count and return the updated poll with all options
    await prisma.option.update({
      where: { id: optionId },
      data: {
        votes: {
          increment: 1,
        },
      },
    });

    // Fetch and return the updated poll with all options
    const updatedPoll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: {
          orderBy: { id: 'asc' }
        },
      },
    });

    res.json(updatedPoll);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to register vote' });
    }
  }
});

export const pollRoutes = router; 