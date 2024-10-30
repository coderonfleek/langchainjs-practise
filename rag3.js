const {ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings} = require("@langchain/google-genai");
const {PDFLoader} = require("@langchain/community/document_loaders/fs/pdf");
const {RecursiveCharacterTextSplitter} = require("langchain/text_splitter");
const {MemoryVectorStore} = require("langchain/vectorstores/memory");
const {pull} = require("langchain/hub");
const {ChatPromptTemplate} = require("@langchain/core/prompts");
const {StringOutputParser} = require("@langchain/core/output_parsers");
const {createStuffDocumentsChain} = require("langchain/chains/combine_documents");
const {RunnableSequence} = require("@langchain/core/runnables");

const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash"
});

async function run() {
    // 1 - Loading with proper text handling
    const loader = new PDFLoader("./myPDF.pdf", {
        splitPages: false,
        // Ensure text is properly extracted as a string
        pdfjs: () => require('pdfjs-dist')
    });
    
    const docs = await loader.load();

    // 2 - Splitting with text validation
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
    });

    // Ensure each document's content is a string before splitting
    const validDocs = docs.map(doc => ({
        ...doc,
        pageContent: String(doc.pageContent).trim()
    }));

    const splits = await textSplitter.splitDocuments(validDocs);

    // 3 - Validate splits before creating embeddings
    const validSplits = splits.map(split => ({
        ...split,
        pageContent: String(split.pageContent).trim()
    })).filter(split => split.pageContent.length > 0);

    // Initialize embeddings with error handling
    const embeddings = new GoogleGenerativeAIEmbeddings({
        modelName: "embedding-001", // Make sure to use the correct embedding model
        maxRetries: 3
    });

    // 4 - Create vector store with validated documents
    const vectorStore = await MemoryVectorStore.fromDocuments(
        validSplits,
        embeddings
    );

    // 5 - Set up retriever with reasonable defaults
    const retriever = vectorStore.asRetriever({
        k: 4  // Number of documents to retrieve
    });

    // 6 - Create the document chain
    const prompt = await pull("rlm/rag-prompt");
    
    const documentChain = await createStuffDocumentsChain({
        llm: model,
        prompt: prompt
    });

    // 7 - Create the full RAG chain
    const ragChain = RunnableSequence.from([
        {
            documents: retriever,
            question: (input) => input.question,
        },
        documentChain
    ]);

    // 8 - Test the chain with error handling
    try {
        const query = "How active was Malware?";
        const response = await ragChain.invoke({
            question: query
        });
        console.log(response);
    } catch (error) {
        console.error("Error during RAG chain execution:", error);
        if (error.message.includes("replace")) {
            console.error("Text formatting error - check document content format");
        }
        throw error;
    }
}

// Add top-level error handling
run().catch(error => {
    console.error("Application error:", error);
    process.exit(1);
});