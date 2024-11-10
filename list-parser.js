const {ChatGoogleGenerativeAI} = require("@langchain/google-genai")
const { CommaSeparatedListOutputParser } = require("@langchain/core/output_parsers")
const {PromptTemplate} = require("@langchain/core/prompts")

const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash"
})

const templateString = "List 10 countries in {continent}.\n{format_instructions}"

const template = PromptTemplate.fromTemplate(templateString)

const listParser = new CommaSeparatedListOutputParser()
const formatInstructions = listParser.getFormatInstructions()

console.log(formatInstructions)

async function run() {

    //Chaining with LCEL
    const chain = template.pipe(model)

    const response = await chain.invoke({
        continent: "Africa",
        format_instructions: formatInstructions
    })

    console.log(response.content)
}


run();
