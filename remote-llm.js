const {ChatGoogleGenerativeAI} = require("@langchain/google-genai")

const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    maxOutputTokens: 15
})

async function run() {
    
    const response = await model.invoke("Write a poem about a cat");

    console.log(response)
}

run();