const {ChatGoogleGenerativeAI} = require("@langchain/google-genai")
const {HumanMessage, SystemMessage} = require("@langchain/core/messages")
const { StringOutputParser } = require("@langchain/core/output_parsers")

const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash"
})

//Use the HumanMessage and SystemMessage classes when you want to pass a structured message with parameters like you will do when calling the API directly (e.g content generation parameters, safety parameters, images or audio for multimodal prompts etc)
//If not the above, you can just use a dynamic string
const messages = [
    new SystemMessage("Translate the following from English to French"),
    new HumanMessage("Hello")
]

const parser = new StringOutputParser()

async function run() {
    
    //Direct Usage
    /* const response = await model.invoke(messages)

    //console.log(response)

    console.log(await parser.invoke(response)) */

    //Chaining with LCEL
    const chain = model.pipe(parser)

    console.log(await chain.invoke(messages))
}


run();
