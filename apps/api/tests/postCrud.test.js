import { jest } from '@jest/globals';

import Content from '../src/models/Content.js';
import getPosts from '../src/routes/posts/get-posts.js';

// Mock database operations
jest.spyOn(Content, 'findOneAndUpdate').mockResolvedValue({});

// Mock Content.aggregate behaviour for getPosts
jest.spyOn(Content, 'aggregate').mockImplementation((pipeline) => {
  // If pipeline contains $count stage, return total
  const isCountPipeline = pipeline.some((stage) => stage.$count);
  if (isCountPipeline) {
    return Promise.resolve([{ total: 1 }]);
  }
  // Otherwise return posts array
  return Promise.resolve([
    {
      _id: 'post123',
      title: 'Title',
      description: 'Desc',
      platform: 'linkedin',
      tags: [],
      length: 'short',
      customLength: undefined,
      tone: 'neutral',
      createdAt: new Date(),
      sourceTitle: 'Source',
      sourceId: 'source123',
    },
  ]);
});

afterEach(() => jest.clearAllMocks());

const { default: deletePost } = await import('../src/routes/posts/delete.js');

function createMockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

// Valid MongoDB ObjectId hex string (24 characters)
const validUserId = '507f1f77bcf86cd799439011';
const validPostId = '507f1f77bcf86cd799439012';

describe('TC6: Save a post and test its deletion', () => {
  it('should delete the post and return status 200', async () => {
    const req = {
      params: { postId: validPostId },
      user: validUserId,
    };
    const res = createMockRes();

    await deletePost(req, res);

    expect(Content.findOneAndUpdate).toHaveBeenCalledWith(
      { 'posts._id': validPostId, user: validUserId },
      { $pull: { posts: { _id: validPostId } } },
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe('TC6: Save a post and test its retrieval', () => {
  it('should retrieve posts with pagination data', async () => {
    const req = {
      query: {},
      user: validUserId,
    };
    const res = createMockRes();

    await getPosts(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.any(Array),
        pagination: expect.objectContaining({ total: 1 }),
      })
    );
  });
}); 