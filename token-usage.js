const {ChatGoogleGenerativeAI} = require("@langchain/google-genai")


const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash"
})

async function run() {
    
    const response = await model.invoke("How many Ballon'dors does Ronaldo have?")

    console.log(response.content)
    console.log(response.usage_metadata)
}

run();