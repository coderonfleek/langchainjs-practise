const {ChatGoogleGenerativeAI} = require("@langchain/google-genai")
const {HumanMessage, SystemMessage} = require("@langchain/core/messages")
const { StringOutputParser } = require("@langchain/core/output_parsers")

const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash"
})


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
