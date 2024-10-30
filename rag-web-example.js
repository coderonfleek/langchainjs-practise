require("cheerio")
const { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { CheerioWebBaseLoader } = require("@langchain/community/document_loaders/web/cheerio");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { pull } = require("langchain/hub");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { RunnableSequence } = require("@langchain/core/runnables");

const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash"
});

async function run() {
    // 1 - Loading
    const loader = new CheerioWebBaseLoader(
        "https://circleci.com/blog/introduction-to-graphql/",
        {
            // Select main content area and remove unnecessary elements
            selector: "article",
            // Remove script tags, ads, etc
            removeTags: ["script", "ads", "nav", "footer", "header"]
        }
    );
    const docs = await loader.load();

    // 2 - Splitting
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
    });

    // Ensure clean text before splitting
    const cleanDocs = docs.map(doc => ({
        ...doc,
        pageContent: String(doc.pageContent)
            .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
            .trim()
    }));

    const splits = await textSplitter.splitDocuments(cleanDocs);

    // 3 - Storing
    const vectorStore = await MemoryVectorStore.fromDocuments(
        splits,
        new GoogleGenerativeAIEmbeddings({
            modelName: "embedding-001"
        })
    );

    // 4 - Retrieving
    const retriever = vectorStore.asRetriever({
        k: 4  // Number of relevant chunks to retrieve
    });

    // 5 - Create the document chain
    const prompt = await pull("rlm/rag-prompt");
    
    const documentChain = await createStuffDocumentsChain({
        llm: model,
        prompt: prompt
    });

    // 6 - Create the full RAG chain
    const ragChain = RunnableSequence.from([
        {
            documents: retriever,
            question: (input) => input.question,
        },
        documentChain
    ]);

    // 7 - Test the chain
    try {
        const query = "What are the main benefits of GraphQL compared to REST?";
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
    process.exit(1);
});