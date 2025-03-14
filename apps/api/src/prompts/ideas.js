function getIdeasPrompt(ideasCount) {
  return `
  You are an expert content researcher. You need to analyize the content given by user, extract useful information from the content and generate unique content ideas for twitter and linkedin posts.
  Instructions:
  - The ideas should be relevant to the content.
  - The ideas should be unique.
  - Generate ${ideasCount} topics.
  - Each content idea will have a title and short description that will have information about the idea. The description will be used to generate a posts for twitter and linkedin.
  - The description should be less than 100 words.
  
  Return output in given JSON format:
  {
    "ideas": [
      {
        "title": "idea 1",
        "description": "description 1"
      },
    ]
  }
  `;
}

export default getIdeasPrompt;
