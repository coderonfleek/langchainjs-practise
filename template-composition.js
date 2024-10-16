const {PromptTemplate, PipelinePromptTemplate} = require("@langchain/core/prompts")

const {ChatGoogleGenerativeAI} = require("@langchain/google-genai")


const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash"
})

const roleTemplate = PromptTemplate.fromTemplate(
    `You are a {language} translator`
)

const exampleTemplate = PromptTemplate.fromTemplate(
    `Here is an example of your translation format for a translation:
    English: Hello
    Translation {hello_translation}`
)

const initiationTemplate = PromptTemplate.fromTemplate(`Now perform your first transaltion: 
    English: {phrase}
    Translation: `)

const completePrompt = PromptTemplate.fromTemplate(`
    {role}
    {example}
    {initiate}
`)

//Swap each template into it's placeholder in completePrompt
const composedPrompt = new PipelinePromptTemplate({
    pipelinePrompts: [
        {
            name: "role",
            prompt: roleTemplate
        },
        {
            name: "example",
            prompt: exampleTemplate
        },
        {
            name: "initiate",
            prompt: initiationTemplate
        }
    ],
    finalPrompt: completePrompt
})

async function run() {

    //Input values using format()
    const formattedPrompt = await composedPrompt.format({
        language: "French",
        hello_translation: "Bonjour",
        phrase: "Thank You"
    })

    //console.log(formattedPrompt)

    //Pass it to a model for an actual AI response
    const chain = composedPrompt.pipe(model);

    const response = await chain.invoke({
        language: "French",
        hello_translation: "Bonjour",
        phrase: "Thank You"
    })

    console.log(response.content)
    
}

run();

