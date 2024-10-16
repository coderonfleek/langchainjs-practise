const {PromptTemplate} = require("@langchain/core/prompts")

const promptTemplate = PromptTemplate.fromTemplate(
    "Write me a poem about {topic}"
)

async function run() {
    
    const result = await promptTemplate.invoke({
        topic: "dogs"
    })

    //Print the PromptValue
    console.log(result)
}

run();