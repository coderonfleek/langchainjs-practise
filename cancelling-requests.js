import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const chat = new ChatOpenAI({
    model: "gpt-4"
});

const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", `Reply every prompt in Spanish`] ,
    ["user", "{input}"]
]);


/* const formattedPrompt = await promptTemplate.format({
    input: "When was the Eiffel tower built"
}) */

const chainToCancel = promptTemplate.pipe(chat)

const controller = new AbortController()

console.time("timer1")

setTimeout(() => controller.abort(), 100)

try {
    await chainToCancel.invoke(
        {
            input: "When was the Eiffel tower built"
        },
        {
            signal: controller.signal
        }
    )
} catch (error) {
    console.log(error)
}

console.timeEnd("timer1")

