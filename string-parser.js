import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";


const chat = new ChatOpenAI();
const parser = new StringOutputParser();

const response = await chat.invoke("What is the capital of France?");
const capital = await parser.parse(response.content);

console.log(typeof capital); // Output: string
console.log(capital); // Output: "Paris" 
