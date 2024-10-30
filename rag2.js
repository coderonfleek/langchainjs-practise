const {ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings} = require("@langchain/google-genai");
const {PDFLoader} = require("@langchain/community/document_loaders/fs/pdf");
const {RecursiveCharacterTextSplitter} = require("langchain/text_splitter");
const {MemoryVectorStore} = require("langchain/vectorstores/memory");
const {pull} = require("langchain/hub");
const {ChatPromptTemplate} = require("@langchain/core/prompts");
const {StringOutputParser} = require("@langchain/core/output_parsers");
const {formatDocumentsAsString} = require("langchain/util/document");
const {RunnableSequence, RunnablePassthrough} = require("@langchain/core/runnables");

const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash"
});

async function run() {
    // 1 - Loading
    const loader = new PDFLoader("./myPDF.pdf");
    const docs = await loader.load();

    // 2 - Splitting
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
    });
    const splits = await textSplitter.splitDocuments(docs);

    // 3 - Storing
    const vectorStore = await MemoryVectorStore.fromDocuments(
        splits,
        new GoogleGenerativeAIEmbeddings()
    );

    // 4 - Retrieving
    const retriever = vectorStore.asRetriever();

    // 5 - Create RAG Chain
    const myRAGprompt = await pull("rlm/rag-prompt");

    const ragChain = RunnableSequence.from([
        {
            context: RunnableSequence.from([
                (input) => input,  // Pass through the input
                retriever,         // Get relevant documents
                formatDocumentsAsString  // Format documents to string
            ]),
            question: new RunnablePassthrough()
        },
        myRAGprompt,
        model,
        new StringOutputParser()
    ]);

    // 6 - Test the chain
    const query = "How active was Malware?";
    const response = await ragChain.invoke({
        question: query  // Make sure to pass as an object with 'question' key
    });
    
    console.log(response);
}

run().catch(console.error);  // Add error handling