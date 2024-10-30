const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

async function run() {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-pro",
  });

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["user", "Write a short story about a cat who goes on an adventure."]
  ]);

  const formattedPrompt = await promptTemplate.format({});

  // Invoke the model with streaming enabled
  const stream = await model.stream(formattedPrompt); 

  // Process the response stream
  for await (const token of stream) {
    process.stdout.write(token.content); // Write each token to the console
  }
}

run();