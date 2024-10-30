import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";


  const chat = new ChatOpenAI();
  const parser = new JsonOutputParser();

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["user", `Generate a JSON object with the following fields for the book "{book}":
      * title
      * author
      * genre 
      * yearPublished`]
  ]);

  const formattedPrompt = await promptTemplate.format({ book: "Pride and Prejudice" });

  const response = await chat.invoke(formattedPrompt);

  //console.log(response.content)

  const bookData = await parser.parse(response.content);
  console.log(bookData);

