const {ChatPromptTemplate} = require("@langchain/core/prompts")
const {ChatOllama} = require("@langchain/ollama");

const llm = new ChatOllama({
    model: "llama3.2:1b"
})

async function run() {

    //With String message
    //const response = await llm.invoke("Who is Steph Curry?")

    //With an Array of messages
    /* const messages = [
        ["system", "You are to reply every sentence in French"],
        ["user", "Thank you for coming"]
    ]

    const response = await llm.invoke(messages); */

    //With message templates instead of text-only
    const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", "You're a {skill} expert"],
        ["user", "{question}"]
    ])

    const chain = promptTemplate.pipe(llm);

    const response = await chain.invoke({
        skill: "Football",
        question: "How many Balon'dors does Ronaldo have?"
    })


    console.log(response.content)
    
}

run();