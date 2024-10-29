const {
    ChatPromptTemplate,
    FewShotChatMessagePromptTemplate,
  } = require("@langchain/core/prompts");
  

  //Create an array of examples (it is conventional to use "input"/"output" to represent prompts and responses)
  const exampleMessages = [
    { input: "Who is the US president", output: "Joe Biden" },
    { input: "What is the Capital of the U.S", output: "Washington D.C" },
  ];

  //Create an example template using a chat template
  const examplePromptTemplate = ChatPromptTemplate.fromMessages([
    ["human", "{input}"],
    ["ai", "{output}"],
  ]);

  //Use the examples and example template to create a fewshot template
  const myFewShotPrompt = new FewShotChatMessagePromptTemplate({
    examplePrompt: examplePromptTemplate,
    examples: exampleMessages,
    inputVariables: [], // no input variables
  });

//You can view the fewshottemplate
/* const result = await fewShotPrompt.invoke({});
console.log(result.toChatMessages()); */

//Use the fewshot template to create your actual prompt
//This will fill in for the example messages between the system message and initiation message
const actualPrompt = ChatPromptTemplate.fromMessages([
    ["system", "You are an expert in U.S politics."],
    myFewShotPrompt,
    ["human", "{input}"],
  ]);

  async function run() {

    console.log(await actualPrompt.format({
        input: "Who is the Vice President of the United States"
    }))
    
  }

  run();

