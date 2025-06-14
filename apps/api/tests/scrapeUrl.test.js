import { jest } from '@jest/globals';

// Mock the Firecrawl SDK
const scrapeMock = jest.fn(() =>
  Promise.resolve({ success: true, markdown: 'Mock blog post content' })
);

const MockFirecrawl = jest.fn().mockImplementation(() => ({
  scrapeUrl: scrapeMock,
}));

jest.unstable_mockModule('@mendable/firecrawl-js', () => ({
  __esModule: true,
  default: MockFirecrawl,
}));

const { default: scrapeUrl } = await import('../src/services/scrape/url.js');

describe('TC2: Input a blog post URL and ensure content is scraped', () => {
  afterEach(() => jest.clearAllMocks());

  it('should return the markdown content when scraping succeeds', async () => {
    const url = 'https://example.com/blog';

    const content = await scrapeUrl(url);

    expect(content).toBe('Mock blog post content');
    expect(MockFirecrawl).toHaveBeenCalledTimes(1);
    expect(scrapeMock).toHaveBeenCalledWith(url, expect.any(Object));
  });
}); 