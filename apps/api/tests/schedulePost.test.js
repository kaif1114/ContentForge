import { jest } from '@jest/globals';

import Content from '../src/models/Content.js';
import Schedule from '../src/models/Schedule.js';
import mongoose from 'mongoose';

// Mock the mongoose session methods
const sessionMock = {
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  abortTransaction: jest.fn(),
  endSession: jest.fn(),
};

jest.spyOn(mongoose, 'startSession').mockResolvedValue(sessionMock);

// Stub ObjectId to avoid cast errors in tests
mongoose.Types.ObjectId = jest.fn().mockImplementation((val) => val);

// Mock helper methods
jest.spyOn(Content, 'aggregate').mockResolvedValue([
  {
    user: 'user123',
    post: { _id: 'post123' },
  },
]);

jest.spyOn(Schedule, 'findOne').mockResolvedValue(null);
jest.spyOn(Schedule, 'create').mockResolvedValue({});
jest.spyOn(Content, 'updateOne').mockResolvedValue({});

const { default: schedulePost } = await import('../src/routes/schedule/schedule.js');

function createMockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

// Freeze Date for consistent behaviour
const futureDate = new Date(Date.now() + 1000 * 60 * 60).toISOString();

describe('TC5: Schedule a post via the content calendar', () => {
  afterEach(() => jest.clearAllMocks());

  it('should schedule the post and return status 201', async () => {
    const req = {
      body: {
        postId: 'post123',
        scheduleDate: futureDate,
        platform: 'linkedin',
      },
      user: 'user123',
    };
    const res = createMockRes();

    await schedulePost(req, res);

    expect(Schedule.create).toHaveBeenCalled();
    expect(Content.updateOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });
}); 