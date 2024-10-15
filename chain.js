const {ChatOpenAI} = require("@langchain/openai")
const {HumanMessage, SystemMessage} = require("@langchain/core/messages")

const model = new ChatOpenAI({
    model: "gpt-3.5"
})


const messages = [
    new SystemMessage("Translate the following from English to French"),
    new HumanMessage("Hello")
]

async function run() {
    await model.invoke(messages)
}


run();
