import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, HumanMessagePromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";


  const chat = new ChatOpenAI();

  const zodSchema = z.object({
    name: z.string().describe("the name in the user's introduction"),
    age: z
      .number()
      .describe(
        "the age in the user's introduction"
      ),
    name: z.string().describe("the user's occupation in the description")
  });

  // 1. Define the schema
  const parser = StructuredOutputParser.fromZodSchema(zodSchema);

  // 2. Get the format instructions
  const formatInstructions = parser.getFormatInstructions();

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", `Extract the city, country, and population from the user's introduction.{format}`] ,
    ["user", "{introduction}"]
  ]);

 /*  const formattedPrompt = await promptTemplate.format({
    introduction: "My name is Fikayo, I am a 36year old Solutions Architect",
    format: formatInstructions
  }); */

  /* const chain = promptTemplate.pipe(chat);

  const response = await chain.invoke({
    introduction: "My name is Fikayo, I am a 36year old Solutions Architect",
    format: formatInstructions
  });

  console.log(response.content) */

  // 3. Parse the response
  /* const introductionData = await parser.parse(response.content);
  console.log(introductionData); */

  const chain = RunnableSequence.from([
    promptTemplate,
    chat,
    parser,
  ]);

  const response = await chain.invoke({
    introduction: "Who is Joe Biden",
    format : formatInstructions
  });
  
  console.log(response);

  


