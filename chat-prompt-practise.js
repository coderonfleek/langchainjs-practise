const {ChatPromptTemplate} = require("@langchain/core/prompts")

const messages = [
    ["system", "You are a Javascript Expert"],
    ["user", "{question}"]
]

const myChatPrompt = ChatPromptTemplate.fromMessages(messages)

async function run() {

    const prompt = await myChatPrompt.invoke({
        question: "What is a Closure"
    })
    console.log(prompt.toChatMessages())
}

run();