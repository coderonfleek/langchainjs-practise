const {ChatGoogleGenerativeAI} = require("@langchain/google-genai")
const {ChatPromptTemplate} = require("@langchain/core/prompts")
const fs =  require("fs/promises")

const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash"
})

async function run() {

    //Using a local image
    const imageData = await fs.readFile("./image.jpeg");
    const base64Image = imageData.toString("base64")

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "Describe the image"],
        ["user", [{
            type: "image_url",
            image_url : "data:image/jpeg;base64,{base64}"
        }]]
    ])

    //console.log(await prompt.invoke({base64 : base64Image}))

    const chain = prompt.pipe(model);

    const response = await chain.invoke({
        base64: base64Image
    })

    console.log(response.content);
    
}

run();
