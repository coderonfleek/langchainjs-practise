const {ChatOpenAI, OpenAIEmbeddings} = require("@langchain/openai");

const {PDFLoader} = require("@langchain/community/document_loaders/fs/pdf")
const {RecursiveCharacterTextSplitter} = require("langchain/text_splitter")
const {MemoryVectorStore} = require("langchain/vectorstores/memory")
const {pull} = require("langchain/hub")
const {ChatPromptTemplate} = require("@langchain/core/prompts")
const {StringOutputParser} = require("@langchain/core/output_parsers")
const {createStuffDocumentsChain} = require("langchain/chains/combine_documents")
const {formatDocumentsAsString} = require("langchain/util/document")
const {RunnableSequence, RunnablePassthrough} = require("@langchain/core/runnables")

const model = new ChatOpenAI({
    model: "gpt-3.5-turbo"
})

async function run() {

    //1 - Loading
    const loader = new PDFLoader("./myPDF.pdf")

    const docs = await loader.load()

    //2 - Splitting
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
    })

    const splits = await textSplitter.splitDocuments(docs)

    //console.log(splits)

    //3 - Storing
    const vectorStore = await MemoryVectorStore.fromDocuments(
        splits,
        new OpenAIEmbeddings()
    )

    //4 - Retrieving

    //Get the retriever
    const retriever = vectorStore.asRetriever();

    //Test the retriever with a query
    const query = "How active was Malware?";
    /* const retrievedDocuments = await retriever.invoke(query)

    console.log(retrievedDocuments) */

    //Get the standard RAG prompt template from Langchain Hub
    const myRAGprompt = await pull<ChatPromptTemplate>("rlm/rag-prompt")

    /* const ragChain = await createStuffDocumentsChain({
        llm : model,
        prompt : myRAGprompt,
        outputParser: new StringOutputParser()
    })

    const response = await ragChain.invoke({
        question: query,
        context: retrievedDocuments
    })

    console.log(response) */

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
    
    const response = await ragChain.invoke({
        question: query  // Make sure to pass as an object with 'question' key
    });
    
    console.log(response);
    
}

run()

