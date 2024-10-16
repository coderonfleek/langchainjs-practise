const {ChatGoogleGenerativeAI} = require("@langchain/google-genai")
const {HumanMessage} = require("@langchain/core/messages")
const fs =  require("fs/promises")

const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash"
})

async function run() {

    //Using a local image
    const imageData = await fs.readFile("./image.jpeg");
    const base64Image = imageData.toString("base64")

    const message = new HumanMessage({
        content: [
            {
                type: "text",
                text: "Describe this image"
            },
            {
                type: "image_url",
                image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`
                }
            }
        ]
    })

    const response = await model.invoke([message])
    console.log(response.content)
    
}

run();
