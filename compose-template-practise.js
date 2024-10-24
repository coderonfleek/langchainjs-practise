const { PipelinePromptTemplate, PromptTemplate } =  require("@langchain/core/prompts");

const {ChatGoogleGenerativeAI} = require("@langchain/google-genai")

const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash"
})

// Define individual prompt templates
const systemPrompt = PromptTemplate.fromTemplate(
  "You are a helpful AI assistant who is also a movie buff."
);

const aiExampleResponsePrompt = PromptTemplate.fromTemplate(
  `
  Your response should always be in this format
    Question: Can you recommend a {example_genre} movie?
    Answer: Sure, {example_answer} is a great choice
  `
);



const newConversationPrompt = PromptTemplate.fromTemplate(
    "Question: Can you recommend a {question_genre} movie?"
)

const finalHumanPrompt = PromptTemplate.fromTemplate(
  `
    {systemRole}
    {aiExampleResponse}
    {newConversation}
  `
);

// Create a PipelinePromptTemplate
const pipelinePrompt = new PipelinePromptTemplate({
  finalPrompt: finalHumanPrompt,
  pipelinePrompts: [
    {
        name: "systemRole",
        prompt: systemPrompt 
    },
    {
        name: "aiExampleResponse",
        prompt: aiExampleResponsePrompt 
    },
    {
        name: "newConversation",
        prompt: newConversationPrompt 
    }
  ]
});



async function run() {

    /* // Format the prompt
    const formattedPrompt = await pipelinePrompt.format({
        example_genre: "sci-fi",
        example_answer: "Blade Runner",
        question_genre: "Comedy"
    });
    console.log(formattedPrompt); */

    const chain = pipelinePrompt.pipe(model);

    const response = await chain.invoke({
        example_genre: "sci-fi",
        example_answer: "Blade Runner",
        question_genre: "Comedy"
    })

    console.log(response.content)
    
}

run();

