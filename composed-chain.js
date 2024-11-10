const {ChatGoogleGenerativeAI} = require("@langchain/google-genai")
const {PromptTemplate} = require("@langchain/core/prompts")
const {RunnableSequence} = require("@langchain/core/runnables")

const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash"
})

const templateString = "List 10 countries in {continent}"

const template = PromptTemplate.fromTemplate(templateString)

//const chain = RunnableSequence.from([template, model])
const chain = template.pipe(model)

const templateString2 = "Which of these {countries} speak English"
const template2 = PromptTemplate.fromTemplate(templateString2)

const composedChain = RunnableSequence.from([
    chain,
    (input) => ({countries : input.content}),
    template2,
    model
])

async function run() {
    
    const response = await composedChain.invoke({
        continent: "Africa"
    })

    console.log(response.content)
}

run();