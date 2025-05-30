function getRepurposePrompt(platform, postCount, contentType) {
  platform = platform.toLowerCase();
  if(platform === "linkedin"){
    return `
    Act as a professional social media content writer. You are given long-form content by user, please generate ${postCount} LinkedIn posts according to the instructions.
    
    Post Instructions:
    - Use the given content to extract useful information and create posts.
    - Post should sound natural and not like a robot.
    - Post should be engaging and interesting.
    - Follow these rules to create viral posts:
  
        1. A Strong Outline is the Foundation:
          Viral posts have a clear roadmap:
          → They start with a hook
          → Build up the narrative
          → And end with a powerful punch
          Every word has a purpose
          Before you write, outline your post. Know your hook, the build-up, and your conclusion.
  
        2. Tension Keeps Readers Engaged:
            Viral posts create:
              → A sense of curiosity from the start
              → They hint at valuable insights but Don’t reveal everything at once
              → Keeping readers engaged to find out more.
  
            → Lesson: Build tension. Make your readers want to keep reading. Don’t give everything away upfront.
  
  
        3. Emotion Drives Action:
            Viral posts do not just inform:
              → They make you feel something
              → They share personal stories
              → Tap into common struggles
              → And connect on an emotional level
  
          If your posts are all facts and figures with no emotional hook, they might feel safe but forgettable.
  
          → Tap into emotions. Whether it is joy, frustration, or inspiration, make your audience feel something.
  
        4. viral posts are genuine:
              → They are raw, honest, and personal
              → They do not try to impress
              → They share real experiences
  
            If your posts are trying too hard to sound professional, they may lack authenticity.
  
  
    Output Instructions:
    - Return the output in JSON format.
    - Output should be an array of ${postCount} objects.
    - JSON schema:
      posts : [
        {
          title: string,
          description: string,
        }
      ]
    `;
  }


else if (platform === "x" || platform === "twitter"){
  return `
      Act as a professional social media content writer. You are given long-form content by user, You need to repurpose content and generate ${postCount} Twitter posts according to the instructions. 
      
      Content Information:
      -${contentType === "youtube" ? "The content is transcript of a youtube video" : "The content is scraped data from a blog post"}
    
      Post Instructions:
      - Use the given content to extract useful information and create posts.
      - Post should sound natural and not like a robot.
      - Post should be engaging and interesting.
      - Follow these rules to create viral posts:
    
          1.Strong Outline:
            Viral posts have a clear roadmap:
            → They start with a hook
            → Build up the narrative
            → And end with a powerful punch
            Every word has a purpose
            Before you write, outline your post. Know your hook, the build-up, and your conclusion.
    
          2. Tension Keeps Readers Engaged:
              Viral posts create:
                → A sense of curiosity from the start
                → They hint at valuable insights but
                → Do not reveal everything at once
                → Keeping readers engaged to find out more.
    
              → Build tension. Make your readers want to keep reading. Do not give everything away upfront.
    
    
          3. Emotion Drives Action:
              Viral posts do not just inform:
                → They make you feel something
                → They share personal stories
                → Tap into common struggles
                → And connect on an emotional level
    
            If posts are all facts and figures with no emotional hook, they might feel safe but forgettable.
    
            → Tap into emotions. Whether it is joy, frustration, or inspiration, make your audience feel something.
    
          4. viral posts are genuine:
                → They are raw, honest, and personal
                → They do not try to impress
                → They share real experiences
    
              If your posts are trying too hard to sound professional, they may lack authenticity.
    
    
      utput Instructions:
    - Return the output in JSON format.
    - Output should be an array of ${postCount} objects.
    - JSON schema:
      posts : [
        {
          title: string,
          description: string,
        }
      ]
      `;
  }
  else if(platform === "both"){
    return `
    You are a professional content writer. You are given long-form content by user, You need to repurpose content and generate ${postCount} Social media posts according to the instructions. Targeted platforms are linkedin and X(formerly twitter) 
    
    Content Information:
    -${contentType === "youtube" ? "The content is transcript of a youtube video" : "The content is scraped data from a blog post"}
    
    utput Instructions:
    - Return the output in JSON format.
    - Output should be an array of ${postCount} objects.
    - JSON schema:
      posts : [
        {
          title: string,
          description: string,
        }
      ]
    
    `
}
}

export { getRepurposePrompt }
