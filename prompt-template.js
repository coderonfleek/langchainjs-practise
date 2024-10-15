const {ChatGoogleGenerativeAI} = require("@langchain/google-genai")
const {ChatPromptTemplate} = require("@langchain/core/prompts")
const { StringOutputParser } = require("@langchain/core/output_parsers")

const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash"
})

//Define a string prompt with a variable
const systemMessageTemplate = `Translate the following into {language}`

//Create a prompt using a template and variables for both the system and user messages
const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemMessageTemplate],
    ["user", "{text}"]
])

const parser = new StringOutputParser()


async function run() {

    /* //Invoke the prompt with values
    const promptValue = await promptTemplate.invoke({
        language: "italian",
        text : "hello"
    })
    
    //console.log(promptValue)

    //Get the actual chat messages
    //console.log(promptValue.toChatMessages()) */

    //Create the chain
    const chain = promptTemplate.pipe(model).pipe(parser)

    const response = await chain.invoke({
        language: "italian",
        text: "hello"
    })

    console.log(response)
}


run();
