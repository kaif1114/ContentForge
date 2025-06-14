import { jest } from '@jest/globals';

// Mock the ai library
const mockGenerateObject = jest.fn().mockResolvedValue({
  object: { result: 'success' }
});

jest.unstable_mockModule('ai', () => ({
  generateObject: mockGenerateObject
}));

// Mock the @ai-sdk/openai library
const mockOpenAI = jest.fn().mockReturnValue('mocked-openai-model');
jest.unstable_mockModule('@ai-sdk/openai', () => ({
  openai: mockOpenAI
}));

const { default: generate } = await import('../src/services/generate.js');

describe('TC9: Verify the OpenAI API integration', () => {
  afterEach(() => jest.clearAllMocks());

  it('should call the OpenAI SDK and return parsed result', async () => {
    const result = await generate('content', 'text', () => 'system prompt', {
      schema: { type: 'object', properties: { result: { type: 'string' } } },
      name: 'testSchema',
    });

    expect(mockOpenAI).toHaveBeenCalledWith('gpt-4o-2024-08-06', { structuredOutputs: true });
    expect(mockGenerateObject).toHaveBeenCalledWith({
      model: 'mocked-openai-model',
      schema: { type: 'object', properties: { result: { type: 'string' } } },
      schemaName: 'testSchema',
      prompt: 'system prompt\n\nContent Type: text\nContent:\ncontent'
    });
    expect(result).toEqual({ result: 'success' });
  });
}); 