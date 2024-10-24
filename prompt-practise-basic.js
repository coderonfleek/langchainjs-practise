const {PromptTemplate} = require("@langchain/core/prompts")

/* const myTemplate = new PromptTemplate({
    template: "How many {item} can fit into a {container}",
    inputVariables: ["item", "container"]
}) */

const myTemplate = PromptTemplate.fromTemplate("How many {item} can fit into a {container}")


async function run() {
    console.log(await myTemplate.invoke({
        item: "Tennis Rackets",
        container: "Classroom"
    }))
    
}

run()