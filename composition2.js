const { PromptTemplate, PipelinePromptTemplate } = require("@langchain/core/prompts");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
});

// Define individual prompt templates
const personalityPrompt = PromptTemplate.fromTemplate(
  "You are a witty and helpful AI assistant."
);

const topicPrompt = PromptTemplate.fromTemplate(
  "I'm interested in learning about {example_topic}. Can you give me a brief overview?\n"
);

const overviewPrompt = PromptTemplate.fromTemplate(
  "Sure, here's a quick overview of {example_topic}: {example_overview}\n"
);

const questionPrompt = PromptTemplate.fromTemplate(
  "{personality} {example_question} {example_answer} Now, can you tell me about the history of {topic}?"
);


// Create a PipelinePromptTemplate
const pipelinePrompt = new PipelinePromptTemplate({
  finalPrompt: questionPrompt, // The final prompt template
  pipelinePrompts: [
    {
      name: "personality",
      prompt: personalityPrompt,
    },
    {
      name: "example_question",
      prompt: topicPrompt,
    },
    {
      name: "example_answer",
      prompt: overviewPrompt,
    },
  ],
});

async function main() {

    /* const formattedPrompt = await pipelinePrompt.format({
        example_topic: "quantum physics",
        example_overview: "It's the study of the very small, where things get weird!",
        topic: "String theory"
    });
    console.log(formattedPrompt);  */
    
    // Pass it to a model for an actual AI response (similar to your example)
    const chain = pipelinePrompt.pipe(model);
    
    const response = await chain.invoke({
        example_topic: "quantum physics",
        example_overview: "It's the study of the very small, where things get weird!",
        topic: "String theory"
    });
    
    console.log(response.content);
    
}

main()


