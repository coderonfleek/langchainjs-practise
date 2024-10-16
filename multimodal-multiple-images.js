const {ChatGoogleGenerativeAI} = require("@langchain/google-genai")
const {ChatPromptTemplate} = require("@langchain/core/prompts")
const fs =  require("fs/promises")

const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash"
})

async function run() {

    //Using a local image
    const imageData1 = await fs.readFile("./image.jpeg");
    const base64Image1 = imageData1.toString("base64")
    const imageData2 = await fs.readFile("./image2.jpg");
    const base64Image2 = imageData2.toString("base64")

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "Describe these two images"],
        ["user", [
            {
                type: "image_url",
                image_url : "data:image/jpeg;base64,{image1}"
            },
            {
                type: "image_url",
                image_url : "data:image/jpeg;base64,{image2}"
            }
        ]]
    ])

    const chain = prompt.pipe(model);

    const response = await chain.invoke({
        image1: base64Image1,
        image2: base64Image2
    })

    console.log(response.content);
    
}

run();
