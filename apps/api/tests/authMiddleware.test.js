import { jest } from '@jest/globals';

import auth from '../src/middleware/auth.js';

function createMockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

describe('TC12: Test user authentication middleware', () => {
  afterEach(() => jest.clearAllMocks());

  it('should deny access when no token or fingerprint provided', () => {
    const req = { header: () => undefined, cookies: {} };
    const res = createMockRes();
    const next = jest.fn();

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
}); 