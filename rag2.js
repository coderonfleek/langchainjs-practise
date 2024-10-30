const {ChatOpenAI, OpenAIEmbeddings} = require("@langchain/openai");
const {PDFLoader} = require("@langchain/community/document_loaders/fs/pdf");
const {RecursiveCharacterTextSplitter} = require("langchain/text_splitter");
const {MemoryVectorStore} = require("langchain/vectorstores/memory");
const {pull} = require("langchain/hub");
const {ChatPromptTemplate} = require("@langchain/core/prompts");
const {StringOutputParser} = require("@langchain/core/output_parsers");
const {createStuffDocumentsChain} = require("langchain/chains/combine_documents");
const {RunnableSequence} = require("@langchain/core/runnables");

const model = new ChatOpenAI({
    model: "gpt-3.5-turbo"
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
        new OpenAIEmbeddings()
    );

    // 4 - Retrieving
    const query = "How active was Malware?";
    const retriever = vectorStore.asRetriever();
    const retrievedDocuments = await retriever.invoke(query)

    // 5 - Create the document chain
    const prompt = await pull("rlm/rag-prompt");
    
    const documentChain = await createStuffDocumentsChain({
        llm: model,
        prompt: prompt,
    });

    // 6 - Create the full RAG chain
    const ragChain = RunnableSequence.from([
        {
            documents: retrievedDocuments,
            question: (input) => input.question,
        },
        documentChain
    ]);

    // 7 - Test the chain
    try {
        
        const response = await ragChain.invoke({
            question: query
        });
        console.log(response);
    } catch (error) {
        console.error("Error during RAG chain execution:", error);
        throw error;
    }
}

run().catch(error => {
    console.error("Application error:", error);
});