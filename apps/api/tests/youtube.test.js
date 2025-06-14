import { jest } from '@jest/globals';

// Mock the global fetch API
const mockTranscript = 'Sample transcript content';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ content: mockTranscript }),
  })
);

const {
  default: getYoutubeTranscript,
} = await import('../src/services/scrape/youtube.js');

describe('TC1: Upload a YouTube transcript and verify that content is scraped', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the transcript content from the API response', async () => {
    const url = 'https://youtube.com/watch?v=dummy';

    const content = await getYoutubeTranscript(url);

    expect(content).toBe(mockTranscript);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.supadata.ai/v1/youtube/transcript?url=${url}&text=true`,
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });
}); 