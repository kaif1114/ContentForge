import { jest } from '@jest/globals';

// Import the model and spy on the database method
import Content from '../src/models/Content.js';

// Spy on findOneAndUpdate before importing the route handler
const findOneAndUpdateSpy = jest
  .spyOn(Content, 'findOneAndUpdate')
  .mockResolvedValue({
    posts: [
      {
        _id: '507f191e810c19729de860ea',
        title: 'Edited title',
        description: 'Edited description',
        tags: ['#edited'],
        platform: 'linkedin',
      },
    ],
  });

const { default: modify } = await import('../src/routes/posts/modify.js');

function createMockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('TC3: Edit a generated post and confirm changes are saved', () => {
  afterEach(() => jest.clearAllMocks());

  it('should update the post and return status 200', async () => {
    const req = {
      params: { postId: '507f191e810c19729de860ea' },
      body: { description: 'Edited description', tags: ['#edited'] },
      user: 'user123',
    };
    const res = createMockRes();

    await modify(req, res);

    expect(findOneAndUpdateSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        post: expect.objectContaining({
          description: 'Edited description',
          tags: ['#edited'],
        }),
      })
    );
  });
}); 