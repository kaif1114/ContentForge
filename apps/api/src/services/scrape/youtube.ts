import "dotenv/config";
async function getYoutubeTranscript(url: string) {
  const transcript = await fetch(
    `https://api.supadata.ai/v1/youtube/transcript?url=${url}&text=true`,
    {
      headers: {
        "X-API-KEY": process.env.SUPADATA_API_KEY,
      },
    }
  );
  const transcriptData = await transcript.json();
  return { content: transcriptData.content };
}

export default getYoutubeTranscript;
