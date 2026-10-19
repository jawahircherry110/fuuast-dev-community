export interface RoadmapResource {
  title: string;
  url: string;
  type: "doc" | "video" | "course" | "github";
}

export interface RoadmapNode {
  id: string;
  title: string;
  tag: "core" | "recommended" | "optional" | "project";
  description: string;
  details: string;
  tools: string[];
  fuuastCourse?: string;
  semester?: string;
  projectIdea?: string;
  resources: RoadmapResource[];
}

export interface RoadmapMilestone {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  category: string;
  nodes: RoadmapNode[];
}

export interface TrackRoadmap {
  id: "ai" | "cs" | "se";
  title: string;
  subtitle: string;
  badge: string;
  color: string;
  accentHex: string;
  roleDescription: string;
  curriculumCode: string;
  milestones: RoadmapMilestone[];
}

export const roadmapsData: Record<"ai" | "cs" | "se", TrackRoadmap> = {
  ai: {
    id: "ai",
    title: "AI Engineer Roadmap",
    subtitle: "Step-by-step guide to becoming a modern AI & Generative AI Engineer in 2026",
    badge: "BSAI Specialization",
    color: "indigo",
    accentHex: "#6366f1",
    roleDescription:
      "An AI Engineer leverages foundation models (LLMs), embeddings, vector databases, RAG architecture, and agentic workflows to build intelligent production applications, without having to train models from scratch.",
    curriculumCode: "FUUAST Department of Computer Science & AI (BSAI)",
    milestones: [
      {
        id: "ai-m1",
        stepNumber: 1,
        title: "1. AI Engineering Fundamentals",
        subtitle: "Core concepts, ecosystem terminology, and developer tooling",
        category: "Foundations",
        nodes: [
          {
            id: "ai-what-is",
            title: "What is an AI Engineer?",
            tag: "core",
            description: "Understanding the role: building software on top of foundation models vs training models from scratch.",
            details: "An AI Engineer focuses on applying modern pre-trained models (LLMs, vision models) via APIs, embeddings, and open-source runtimes. Unlike ML Researchers who invent model architectures or data scientists who specialize in statistical modeling, AI engineers design scalable, real-world systems integrating AI into web, mobile, and enterprise platforms.",
            tools: ["Python 3.11+", "UV / Poetry", "JupyterLab", "Git"],
            fuuastCourse: "Introduction to Computing & AI Foundations",
            semester: "Semester 1 - 2",
            projectIdea: "Set up a structured Python AI workspace with virtual environments and run simple inference scripts.",
            resources: [
              { title: "Latent Space: The AI Engineer", url: "https://www.latent.space/p/ai-engineer", type: "doc" },
              { title: "Roadmap.sh AI Engineer Guide", url: "https://roadmap.sh/ai-engineer", type: "doc" },
            ],
          },
          {
            id: "ai-terminology",
            title: "Core AI & LLM Terminology",
            tag: "core",
            description: "Tokens, Context Windows, Latency vs Throughput, Inference, Temperature, Top-P.",
            details: "Master the fundamental vocabulary: Tokens (pieces of words processed by models), Context Window (max memory size per request), Temperature (randomness/creativity level), Top-P (nucleus sampling), Hallucination (generating false information), and Latency (Time to First Token - TTFT).",
            tools: ["Tiktoken", "Token Calculators", "OpenAI Tokenizer"],
            fuuastCourse: "Artificial Intelligence (BSAI-201)",
            semester: "Semester 3",
            projectIdea: "Build a token-counting CLI utility that estimates API pricing for Urdu and English texts across models.",
            resources: [
              { title: "OpenAI Tokenizer Tool", url: "https://platform.openai.com/tokenizer", type: "doc" },
              { title: "DeepLearning.AI: AI for Everyone", url: "https://www.deeplearning.ai/", type: "course" },
            ],
          },
        ],
      },
      {
        id: "ai-m2",
        stepNumber: 2,
        title: "2. Foundation Models & API Providers",
        subtitle: "Interacting with proprietary and state-of-the-art frontier models",
        category: "Model APIs",
        nodes: [
          {
            id: "ai-openai",
            title: "OpenAI Platform & GPT Models",
            tag: "core",
            description: "GPT-4o, GPT-4o-mini, o1/o3 reasoning models, Chat Completions, Function Calling.",
            details: "Master OpenAI's SDK: Chat Completions API, multi-modal vision inputs, streaming responses (`stream: true`), structured output enforcement via Pydantic schemas, and the playground for prompt testing.",
            tools: ["OpenAI Python SDK", "Pydantic", "Instructor"],
            fuuastCourse: "Programming for AI",
            semester: "Semester 3",
            projectIdea: "Build a multi-turn terminal chatbot with streaming responses and structured JSON summary generation.",
            resources: [
              { title: "OpenAI API Documentation", url: "https://platform.openai.com/docs", type: "doc" },
              { title: "OpenAI Cookbook", url: "https://github.com/openai/openai-cookbook", type: "github" },
            ],
          },
          {
            id: "ai-claude-gemini",
            title: "Anthropic Claude & Google Gemini",
            tag: "recommended",
            description: "Claude 3.5 Sonnet (Artifacts, prompt caching), Gemini 1.5 Pro (2M token context, multimodal audio/video).",
            details: "Explore leading alternatives: Claude 3.5 Sonnet excels at coding and technical writing, with prompt caching reducing cost by up to 90%. Google Gemini 1.5 offers massive 1M-2M token context windows capable of analyzing entire codebases or 1-hour video lectures directly.",
            tools: ["Anthropic SDK", "Google GenAI SDK", "LangChain ChatModels"],
            fuuastCourse: "Advanced AI Applications",
            semester: "Semester 4",
            projectIdea: "Create an automated video lecture summarizer that takes a FUUAST lecture recording and generates chapter timestamps with Gemini.",
            resources: [
              { title: "Anthropic Documentation", url: "https://docs.anthropic.com/", type: "doc" },
              { title: "Google AI for Developers", url: "https://ai.google.dev/docs", type: "doc" },
            ],
          },
        ],
      },
      {
        id: "ai-m3",
        stepNumber: 3,
        title: "3. Prompt Engineering & Structured Outputs",
        subtitle: "Crafting bulletproof system instructions and deterministic outputs",
        category: "Prompting",
        nodes: [
          {
            id: "ai-prompt-patterns",
            title: "Advanced Prompting Patterns",
            tag: "core",
            description: "Role Prompting, Few-Shot In-Context Learning, Chain-of-Thought (CoT), Step-Back Prompting.",
            details: "Go beyond basic prompts: use System Prompts to establish persona and boundaries; Few-Shot examples to enforce tone and edge cases; Chain-of-Thought ('think step by step') to dramatically improve logic and arithmetic reasoning; and delimiter separation for secure user input.",
            tools: ["Promptfoo", "OpenAI Evals", "Langfuse Prompt Management"],
            fuuastCourse: "Knowledge Representation & Reasoning",
            semester: "Semester 4",
            projectIdea: "Construct an AI code reviewer prompt with strict rubric evaluation and automated unit-test generation.",
            resources: [
              { title: "DAIR.AI Prompt Engineering Guide", url: "https://www.promptingguide.ai/", type: "doc" },
              { title: "Anthropic Prompt Library", url: "https://docs.anthropic.com/en/prompt-library/library", type: "doc" },
            ],
          },
          {
            id: "ai-structured-outputs",
            title: "Structured Outputs & JSON Schema",
            tag: "core",
            description: "Guaranteed JSON schemas, Pydantic validation, function definitions, tool arguments.",
            details: "Production systems cannot rely on unpredictable markdown. Modern LLMs support guaranteed structured outputs: the model is mathematically constrained during sampling to only produce tokens conforming to your exact Pydantic / JSON schema.",
            tools: ["Pydantic v2", "Instructor Library", "JSON Schema"],
            fuuastCourse: "Software Engineering for AI",
            semester: "Semester 4",
            projectIdea: "Extract structured student data, CGPA, and course grades from unstructured scanned academic PDFs into clean JSON.",
            resources: [
              { title: "OpenAI Structured Outputs Guide", url: "https://platform.openai.com/docs/guides/structured-outputs", type: "doc" },
              { title: "Instructor Library Docs", url: "https://python.useinstructor.com/", type: "github" },
            ],
          },
        ],
      },
      {
        id: "ai-m4",
        stepNumber: 4,
        title: "4. Open-Source Models & Local AI",
        subtitle: "Self-hosting models and running privacy-preserving local inference",
        category: "Open Source",
        nodes: [
          {
            id: "ai-huggingface",
            title: "Hugging Face & Transformers",
            tag: "core",
            description: "Hugging Face Hub, model weights, tokenizers, pipeline API, quantized GGUF models.",
            details: "The GitHub of Machine Learning. Learn how to search, download, and run open models (Llama 3, Mistral, Qwen, DeepSeek). Understand quantization (FP16 -> INT8 -> INT4/GGUF) to run 7B-8B parameter models on consumer laptops and GPUs.",
            tools: ["Hugging Face Hub", "Transformers", "Accelerate", "BitsAndBytes"],
            fuuastCourse: "Deep Learning (BSAI-301)",
            semester: "Semester 5",
            projectIdea: "Run an open-source Urdu/English multilingual sentiment analyzer locally using Hugging Face pipelines.",
            resources: [
              { title: "Hugging Face NLP Course", url: "https://huggingface.co/learn/nlp-course", type: "course" },
              { title: "The Bloke GGUF Models Guide", url: "https://huggingface.co/TheBloke", type: "doc" },
            ],
          },
          {
            id: "ai-ollama-vllm",
            title: "Local Runtimes: Ollama & vLLM",
            tag: "recommended",
            description: "Ollama CLI/API for desktop, vLLM for high-throughput production GPU serving with PagedAttention.",
            details: "Run local models effortlessly with Ollama (`ollama run llama3`). For production multi-user inference on Linux servers, master vLLM: it utilizes PagedAttention to achieve 10x-24x higher throughput than standard Hugging Face pipelines.",
            tools: ["Ollama", "vLLM", "llama.cpp", "Docker"],
            fuuastCourse: "Cloud Computing & AI Infrastructure",
            semester: "Semester 5",
            projectIdea: "Deploy a private, offline AI assistant on a local university lab workstation accessible via REST API.",
            resources: [
              { title: "Ollama Official Docs", url: "https://ollama.com", type: "doc" },
              { title: "vLLM Documentation", url: "https://docs.vllm.ai", type: "github" },
            ],
          },
        ],
      },
      {
        id: "ai-m5",
        stepNumber: 5,
        title: "5. Embeddings & Vector Databases",
        subtitle: "Transforming text into high-dimensional semantic vectors for instant search",
        category: "Vector Search",
        nodes: [
          {
            id: "ai-embeddings",
            title: "Vector Embeddings & Semantic Similarity",
            tag: "core",
            description: "High-dimensional vector spaces, Cosine Similarity, Dot Product, Sentence Transformers.",
            details: "Embeddings represent the semantic meaning of text as arrays of floating-point numbers (e.g. 1536 dimensions). Sentences with similar meanings have high cosine similarity regardless of exact word overlap (e.g. 'Can I change my major?' matches 'Course transfer procedure').",
            tools: ["text-embedding-3-small", "BGE-m3", "all-MiniLM-L6-v2", "NumPy"],
            fuuastCourse: "Natural Language Processing (BSAI-304)",
            semester: "Semester 5",
            projectIdea: "Build a semantic search engine over FUUAST course descriptions and syllabus outlines.",
            resources: [
              { title: "What are Vector Embeddings?", url: "https://www.pinecone.io/learn/vector-embeddings/", type: "doc" },
              { title: "Sentence-Transformers Library", url: "https://sbert.net/", type: "github" },
            ],
          },
          {
            id: "ai-vectordb",
            title: "Vector Databases: ChromaDB, Pinecone, pgvector",
            tag: "core",
            description: "HNSW indexing, metadata filtering, hybrid search (dense + BM25 sparse), vector storage.",
            details: "Store and query millions of vectors in milliseconds. Master local embedded vector stores like ChromaDB and LanceDB for prototypes, cloud vector stores like Pinecone and Qdrant, and production PostgreSQL with `pgvector` for unified relational + vector data.",
            tools: ["ChromaDB", "pgvector (PostgreSQL)", "Pinecone", "Qdrant"],
            fuuastCourse: "Advanced Database Systems",
            semester: "Semester 5",
            projectIdea: "Build an indexed vector database of 100+ research papers published by FUUAST faculty members.",
            resources: [
              { title: "ChromaDB Documentation", url: "https://docs.trychroma.com/", type: "doc" },
              { title: "pgvector GitHub & Guide", url: "https://github.com/pgvector/pgvector", type: "github" },
            ],
          },
        ],
      },
      {
        id: "ai-m6",
        stepNumber: 6,
        title: "6. Retrieval-Augmented Generation (RAG)",
        subtitle: "Connecting LLMs to proprietary private data without retraining",
        category: "RAG Architecture",
        nodes: [
          {
            id: "ai-rag-pipeline",
            title: "RAG Pipeline & Chunking Strategies",
            tag: "core",
            description: "Document loading (PDFs, Markdown, Web), chunking (recursive, semantic, windowing), retrieval & synthesis.",
            details: "RAG injects relevant facts into the prompt context. Master document ingestion, text splitting (recursive character chunking with overlap), embedding creation, semantic retrieval, and synthesizing the final citation-backed answer.",
            tools: ["LangChain", "LlamaIndex", "Unstructured", "PyPDF"],
            fuuastCourse: "Final Year Project (FYP-I)",
            semester: "Semester 6 - 7",
            projectIdea: "Develop the official FUUAST Campus Assistant: a RAG chatbot answering student queries based on official university handbook.",
            resources: [
              { title: "LlamaIndex RAG Guide", url: "https://docs.llamaindex.ai/", type: "doc" },
              { title: "LangChain RAG Tutorial", url: "https://python.langchain.com/docs/tutorials/rag/", type: "doc" },
            ],
          },
          {
            id: "ai-advanced-rag",
            title: "Advanced RAG: Re-ranking & Query Transformation",
            tag: "recommended",
            description: "Cross-encoder re-ranking (Cohere Rerank, BGE Reranker), HyDE (Hypothetical Document Embeddings), Parent-Child Chunking.",
            details: "Naïve vector search often retrieves noisy chunks. Advanced RAG uses Query Rewriting to expand student queries, HyDE to generate hypothetical answers before searching, and Cross-Encoder Re-rankers to re-sort the top 20 candidates down to the 3 most precise context passages.",
            tools: ["Cohere Rerank", "BGE-Reranker-Large", "FlashRank", "BM25"],
            fuuastCourse: "Information Retrieval & Search",
            semester: "Semester 7",
            projectIdea: "Upgrade the university RAG system with a Cross-Encoder reranker to improve answer precision from 68% to 94%.",
            resources: [
              { title: "Advanced RAG Techniques", url: "https://github.com/NirDiamant/RAG_Techniques", type: "github" },
              { title: "Cohere Rerank Documentation", url: "https://docs.cohere.com/docs/rerank-overview", type: "doc" },
            ],
          },
        ],
      },
      {
        id: "ai-m7",
        stepNumber: 7,
        title: "7. AI Agents & Tool Calling",
        subtitle: "Autonomous reasoning loops, multi-agent collaboration, and tool use",
        category: "Agents",
        nodes: [
          {
            id: "ai-function-calling",
            title: "Function Calling & Tools",
            tag: "core",
            description: "Allowing LLMs to invoke APIs, database queries, calculators, and external tools.",
            details: "Provide the model with JSON definitions of Python functions (e.g. `check_fee_status(roll_no)` or `query_db(sql)`). The LLM determines when to call the function and provides valid arguments, while your code executes the function and returns the result to the model.",
            tools: ["OpenAI Tools", "LangChain Tools", "FastAPI"],
            fuuastCourse: "Artificial Intelligence (BSAI-201)",
            semester: "Semester 6",
            projectIdea: "Build an AI student advisor agent that queries real MySQL student fee records and exam timetables via function calls.",
            resources: [
              { title: "OpenAI Function Calling Guide", url: "https://platform.openai.com/docs/guides/function-calling", type: "doc" },
            ],
          },
          {
            id: "ai-agentic-frameworks",
            title: "Agent Architectures: LangGraph & CrewAI",
            tag: "recommended",
            description: "ReAct loops (Reason + Act), stateful graphs, memory, multi-agent swarms.",
            details: "Modern agents go beyond single prompts: LangGraph allows deterministic cyclical graphs with human-in-the-loop approvals, state persistence, and branching. CrewAI enables multi-agent teams where specialized agents (Researcher, Writer, Reviewer) collaborate to accomplish complex objectives.",
            tools: ["LangGraph", "CrewAI", "AutoGen", "Model Context Protocol (MCP)"],
            fuuastCourse: "Final Year Project (FYP-I & II)",
            semester: "Semester 7 - 8",
            projectIdea: "Develop a multi-agent research team: Agent 1 searches academic papers, Agent 2 summarizes findings, Agent 3 validates citations.",
            resources: [
              { title: "LangGraph Tutorials", url: "https://langchain-ai.github.io/langgraph/", type: "doc" },
              { title: "CrewAI Documentation", url: "https://docs.crewai.com/", type: "doc" },
            ],
          },
        ],
      },
      {
        id: "ai-m8",
        stepNumber: 8,
        title: "8. Evaluation, Observability & Safety",
        subtitle: "Measuring LLM accuracy, tracking token costs, and defending against jailbreaks",
        category: "Production AI",
        nodes: [
          {
            id: "ai-evals",
            title: "LLM Evaluation Frameworks (Evals)",
            tag: "core",
            description: "Ragas, DeepEval, Faithfulness, Answer Relevance, Context Precision, LLM-as-a-Judge.",
            details: "You cannot improve what you cannot measure. Learn how to write deterministic assertions and model-based evaluations using Ragas: Faithfulness (did the LLM hallucinate?), Answer Relevance (did it answer the user's question?), and Context Recall.",
            tools: ["Ragas", "DeepEval", "Giskard", "PyTest"],
            fuuastCourse: "Software Quality Assurance for AI",
            semester: "Semester 7",
            projectIdea: "Implement a CI/CD test suite that automatically evaluates 50 test questions against the university RAG pipeline before deployment.",
            resources: [
              { title: "Ragas Documentation", url: "https://docs.ragas.io/", type: "doc" },
              { title: "DeepEval GitHub", url: "https://github.com/confident-ai/deepeval", type: "github" },
            ],
          },
          {
            id: "ai-observability-safety",
            title: "Observability (LangSmith) & AI Safety",
            tag: "recommended",
            description: "Tracing API calls, token cost tracking, prompt injection defenses, NeMo Guardrails.",
            details: "In production, track every LLM interaction: latency, token spend, error rates with LangSmith or Langfuse. Protect systems against prompt injection, jailbreaks, and sensitive data leakage using NeMo Guardrails and OpenAI Moderation API.",
            tools: ["LangSmith", "Langfuse", "NeMo Guardrails", "OpenAI Moderation"],
            fuuastCourse: "Cybersecurity & Information Ethics",
            semester: "Semester 8",
            projectIdea: "Add Langfuse tracing and prompt injection guardrails to the FUUAST AI chatbot deployment.",
            resources: [
              { title: "LangSmith Tracing Guide", url: "https://docs.smith.langchain.com/", type: "doc" },
              { title: "NeMo Guardrails by NVIDIA", url: "https://github.com/NVIDIA/NeMo-Guardrails", type: "github" },
            ],
          },
        ],
      },
    ],
  },
  cs: {
    id: "cs",
    title: "Computer Science Roadmap",
    subtitle: "Complete computer science & systems curriculum roadmap inspired by roadmap.sh",
    badge: "BSCS Foundation & Systems",
    color: "blue",
    accentHex: "#2563eb",
    roleDescription:
      "Computer Science forms the bedrock of computing: mastering fundamental data structures, high-performance algorithms, operating systems, memory management, networks, and large-scale distributed system design.",
    curriculumCode: "FUUAST Department of Computer Science (BSCS)",
    milestones: [
      {
        id: "cs-m1",
        stepNumber: 1,
        title: "1. Programming Foundations & Memory",
        subtitle: "C++, pointers, references, control structures, and computational thinking",
        category: "Programming Core",
        nodes: [
          {
            id: "cs-cpp",
            title: "C++ & Low-Level Memory Management",
            tag: "core",
            description: "Pointers, references, heap vs stack memory, dynamic allocation (new/delete), RAII.",
            details: "C++ teaches you how computers actually operate: understanding manual memory allocation, pointer arithmetic, memory leaks, and cache locality gives you a massive advantage across any language.",
            tools: ["C++17/20", "GCC / Clang", "GDB Debugger", "Valgrind"],
            fuuastCourse: "Programming Fundamentals (CS-101) & OOP (CS-102)",
            semester: "Semester 1 - 2",
            projectIdea: "Build a custom dynamic memory string class (`MyString`) implementing deep copy, move semantics, and dynamic resizing.",
            resources: [
              { title: "LearnCpp.com Free Tutorials", url: "https://www.learncpp.com/", type: "doc" },
              { title: "C++ Reference Documentation", url: "https://en.cppreference.com/", type: "doc" },
            ],
          },
          {
            id: "cs-oop",
            title: "Object-Oriented Programming (OOP)",
            tag: "core",
            description: "Encapsulation, Inheritance, Polymorphism, Abstract Classes, Interfaces.",
            details: "Master the 4 pillars of OOP: model real-world domains with classes, leverage virtual functions for runtime polymorphism, and design modular systems that prevent code duplication.",
            tools: ["C++ / Java", "UML Class Diagrams"],
            fuuastCourse: "Object Oriented Programming (CS-102)",
            semester: "Semester 2",
            projectIdea: "Develop a console-based University Student Management System with inheritance hierarchies and file persistence.",
            resources: [
              { title: "Refactoring.Guru: OOP Concepts", url: "https://refactoring.guru/", type: "doc" },
            ],
          },
        ],
      },
      {
        id: "cs-m2",
        stepNumber: 2,
        title: "2. Data Structures & Algorithms (DSA)",
        subtitle: "Linear & non-linear data structures, asymptotic notation, and algorithmic paradigms",
        category: "DSA Core",
        nodes: [
          {
            id: "cs-data-structures",
            title: "Essential Data Structures",
            tag: "core",
            description: "Arrays, Linked Lists, Stacks, Queues, Hash Tables, Binary Search Trees, Heaps, Graphs.",
            details: "Master implementations from scratch: singly & doubly linked lists; stacks and queues; hash maps with separate chaining / open addressing; balanced trees (AVL/Red-Black); min/max heaps; and adjacency lists for graphs.",
            tools: ["C++ STL", "LeetCode", "NeetCode 150"],
            fuuastCourse: "Data Structures & Algorithms (CS-201)",
            semester: "Semester 3",
            projectIdea: "Implement a priority-based hospital patient queue using a custom Min-Heap data structure in C++.",
            resources: [
              { title: "NeetCode DSA Roadmap", url: "https://neetcode.io/roadmap", type: "doc" },
              { title: "Visualgo: Visualizing Data Structures", url: "https://visualgo.net/", type: "doc" },
            ],
          },
          {
            id: "cs-algorithms",
            title: "Algorithms & Complexity Analysis",
            tag: "core",
            description: "Big-O Notation, Binary Search, Merge/Quick Sort, BFS/DFS, Dijkstra, Dynamic Programming.",
            details: "Analyze algorithmic time and space complexity ($O(1)$, $O(\log N)$, $O(N)$, $O(N \log N)$, $O(N^2)$). Master graph traversal (BFS shortest path, DFS cycle detection), shortest path algorithms, and Dynamic Programming (memoization & tabulation).",
            tools: ["LeetCode", "HackerRank", "Codeforces"],
            fuuastCourse: "Design & Analysis of Algorithms (CS-202)",
            semester: "Semester 4",
            projectIdea: "Build a GPS navigation pathfinder that computes the shortest path between Islamabad campus landmarks using Dijkstra's algorithm.",
            resources: [
              { title: "MIT OpenCourseWare: Intro to Algorithms", url: "https://ocw.mit.edu/", type: "course" },
              { title: "CP-Algorithms Guide", url: "https://cp-algorithms.com/", type: "doc" },
            ],
          },
        ],
      },
      {
        id: "cs-m3",
        stepNumber: 3,
        title: "3. Computer Systems & Operating Systems",
        subtitle: "Processes, threads, concurrency, virtual memory, and kernel architecture",
        category: "Systems",
        nodes: [
          {
            id: "cs-os-concurrency",
            title: "Operating Systems & Concurrency",
            tag: "core",
            description: "Processes vs Threads, CPU Scheduling, Mutex, Semaphores, Deadlocks, Inter-Process Communication (IPC).",
            details: "Understand how the OS multiplexes hardware: process lifecycles, context switching overhead, thread synchronization, race conditions, critical sections, and avoiding deadlocks using Banker's algorithm.",
            tools: ["POSIX Threads (pthread)", "Linux Bash", "C System Calls (fork, pipe)"],
            fuuastCourse: "Operating Systems (CS-301)",
            semester: "Semester 5",
            projectIdea: "Implement a multi-threaded web server in C using thread pools and POSIX mutex locks to handle concurrent client requests.",
            resources: [
              { title: "OSTEP: Operating Systems in Three Easy Pieces", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/", type: "doc" },
            ],
          },
          {
            id: "cs-virtual-memory",
            title: "Memory Management & File Systems",
            tag: "core",
            description: "Paging, Virtual Memory, TLB, Page Replacement Algorithms (LRU), Inodes, File System design.",
            details: "How modern computers give every process an isolated 64-bit address space: page tables, Translation Lookaside Buffers (TLB), page faults, cache eviction policies, and Unix file system inodes.",
            tools: ["Linux /proc filesystem", "GDB", "Valgrind"],
            fuuastCourse: "Computer Architecture & Organization",
            semester: "Semester 5",
            projectIdea: "Simulate a Virtual Memory Manager with LRU page replacement and TLB hit/miss statistics in C++.",
            resources: [
              { title: "Computer Systems: A Programmer's Perspective (CS:APP)", url: "https://csapp.cs.cmu.edu/", type: "doc" },
            ],
          },
        ],
      },
      {
        id: "cs-m4",
        stepNumber: 4,
        title: "4. Networking & Database Architecture",
        subtitle: "TCP/IP protocols, sockets, relational database internals, and transaction isolation",
        category: "Networks & DBs",
        nodes: [
          {
            id: "cs-networks",
            title: "Computer Networks & Socket Programming",
            tag: "core",
            description: "OSI & TCP/IP stack, TCP 3-way handshake, UDP, DNS resolution, HTTP/HTTPS, TLS, Sockets.",
            details: "Understand how bits cross the globe: packet switching, routing algorithms, reliable transmission over TCP with sliding window flow control, DNS hierarchy, and low-level BSD socket programming.",
            tools: ["Wireshark", "C/Python Sockets", "cURL", "traceroute"],
            fuuastCourse: "Computer Networks (CS-302)",
            semester: "Semester 6",
            projectIdea: "Build a custom multi-client chat room application using raw TCP socket programming in Python or C++.",
            resources: [
              { title: "Beej's Guide to Network Programming", url: "https://beej.us/guide/bgnet/", type: "doc" },
              { title: "Stanford CS144: Computer Networking", url: "https://cs144.github.io/", type: "course" },
            ],
          },
          {
            id: "cs-db-internals",
            title: "Database Internals & ACID Transactions",
            tag: "core",
            description: "B-Tree indexing, write-ahead logging (WAL), query execution plans, transaction isolation levels.",
            details: "Go beyond basic SQL queries: study how database storage engines work under the hood, how B+ Trees enable logarithmic range queries, how Write-Ahead Logs guarantee durability, and how isolation levels prevent dirty reads and phantom reads.",
            tools: ["PostgreSQL", "SQLite", "EXPLAIN ANALYZE"],
            fuuastCourse: "Database Systems (CS-203)",
            semester: "Semester 4",
            projectIdea: "Build a mini key-value storage engine in C++ with append-only logging and in-memory indexing.",
            resources: [
              { title: "Use The Index, Luke! SQL Indexing Guide", url: "https://use-the-index-luke.com/", type: "doc" },
              { title: "CMU Database Group: Database Systems", url: "https://15445.courses.cs.cmu.edu/", type: "course" },
            ],
          },
        ],
      },
      {
        id: "cs-m5",
        stepNumber: 5,
        title: "5. Distributed Systems & System Design",
        subtitle: "Designing resilient, scalable, fault-tolerant planetary-scale architectures",
        category: "System Design",
        nodes: [
          {
            id: "cs-sys-design",
            title: "High-Level System Design",
            tag: "core",
            description: "Horizontal scaling, load balancers, reverse proxies, caching strategies, message queues.",
            details: "How modern tech giants scale to millions of requests per second: load balancing (Round Robin, Least Connections), CDN caching, caching patterns (Cache-Aside, Write-Through), and asynchronous task queues.",
            tools: ["Redis", "Nginx", "RabbitMQ / Kafka", "Docker"],
            fuuastCourse: "Distributed Systems & Cloud Computing",
            semester: "Semester 7",
            projectIdea: "Design a high-scale URL Shortener (like Bitly) or a real-time notification service with Redis and Nginx.",
            resources: [
              { title: "System Design Primer by Donne Martin", url: "https://github.com/donnemartin/system-design-primer", type: "github" },
              { title: "ByteByteGo System Design Newsletter", url: "https://bytebytego.com/", type: "doc" },
            ],
          },
          {
            id: "cs-distributed",
            title: "Distributed Consensus & Consistency",
            tag: "recommended",
            description: "CAP Theorem, Eventual Consistency, Raft / Paxos consensus, distributed transactions.",
            details: "When data is split across multiple servers: the tradeoffs between Consistency, Availability, and Partition Tolerance (CAP); distributed consensus algorithms like Raft; and vector clocks for tracking causal events.",
            tools: ["Etcd", "Raft Consensus Visualizer"],
            fuuastCourse: "Final Year Project (FYP-I & II)",
            semester: "Semester 7 - 8",
            projectIdea: "Implement a simplified 3-node distributed leader election cluster using the Raft consensus algorithm.",
            resources: [
              { title: "MIT 6.824: Distributed Systems", url: "https://pdos.csail.mit.edu/6.824/", type: "course" },
              { title: "Raft Consensus Visual Guide", url: "https://raft.github.io/", type: "doc" },
            ],
          },
        ],
      },
    ],
  },
  se: {
    id: "se",
    title: "Software Engineering Roadmap",
    subtitle: "Complete software architecture, full-stack, DevOps, and SQA roadmap",
    badge: "BSSE Enterprise & Full-Stack",
    color: "sky",
    accentHex: "#0284c7",
    roleDescription:
      "Software Engineering emphasizes building reliable, testable, enterprise-grade software products: clean architecture, full-stack web/mobile apps, automated CI/CD pipelines, DevOps, and rigorous quality assurance.",
    curriculumCode: "FUUAST Department of Software Engineering (BSSE)",
    milestones: [
      {
        id: "se-m1",
        stepNumber: 1,
        title: "1. Software Architecture & Clean Design",
        subtitle: "SOLID principles, design patterns, clean code, and refactoring",
        category: "Software Design",
        nodes: [
          {
            id: "se-solid",
            title: "SOLID Principles & Clean Code",
            tag: "core",
            description: "Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.",
            details: "The gold standard for maintainable code: write functions that do one thing well, design classes open for extension but closed for modification, and depend on abstractions rather than concrete implementations.",
            tools: ["TypeScript", "Python", "Clean Code Book", "ESLint"],
            fuuastCourse: "Software Requirements & Design (SE-201)",
            semester: "Semester 3",
            projectIdea: "Refactor a monolithic, tightly-coupled legacy code snippet into clean, decoupled SOLID classes with dependency injection.",
            resources: [
              { title: "Refactoring.Guru: SOLID Principles", url: "https://refactoring.guru/solid-principles", type: "doc" },
            ],
          },
          {
            id: "se-patterns",
            title: "Design Patterns (GoF)",
            tag: "core",
            description: "Creational (Factory, Singleton), Structural (Adapter, Decorator), Behavioral (Observer, Strategy).",
            details: "Proven solutions to recurring software engineering problems: use the Strategy pattern to swap payment gateways dynamically; the Observer pattern for event-driven updates; and the Factory pattern for clean object creation.",
            tools: ["TypeScript", "Java / C#"],
            fuuastCourse: "Software Architecture & Design Patterns (SE-301)",
            semester: "Semester 4",
            projectIdea: "Build an extensible E-commerce checkout simulator supporting multiple discount strategies and notification channels.",
            resources: [
              { title: "Refactoring.Guru: Design Patterns", url: "https://refactoring.guru/design-patterns", type: "doc" },
            ],
          },
        ],
      },
      {
        id: "se-m2",
        stepNumber: 2,
        title: "2. Full-Stack Web & Mobile Development",
        subtitle: "Modern frontend frameworks, RESTful APIs, and cross-platform apps",
        category: "Full Stack",
        nodes: [
          {
            id: "se-frontend",
            title: "Modern Frontend: React & Next.js",
            tag: "core",
            description: "Component lifecycle, state management, Server Components, Tailwind CSS, API fetching.",
            details: "Build blazing-fast, responsive web interfaces with Next.js App Router, React Server Components (RSC), Tailwind CSS styling, client state with Zustand, and optimistic UI updates.",
            tools: ["Next.js 15+", "React", "TypeScript", "Tailwind CSS"],
            fuuastCourse: "Web Technologies (SE-202)",
            semester: "Semester 4",
            projectIdea: "Build an interactive student portal with profile editing, course registrations, and real-time announcements.",
            resources: [
              { title: "Next.js Learn Course", url: "https://nextjs.org/learn", type: "course" },
              { title: "Roadmap.sh Frontend Guide", url: "https://roadmap.sh/frontend", type: "doc" },
            ],
          },
          {
            id: "se-backend",
            title: "Backend API Engineering & REST",
            tag: "core",
            description: "Node.js/Express or FastAPI, JWT authentication, middleware, request validation, ORMs.",
            details: "Design robust, production-ready RESTful APIs: secure authentication with JWT & HTTP-only cookies, input sanitization with Zod or Pydantic, database migrations with Prisma or Drizzle ORM, and rate limiting.",
            tools: ["Node.js / Express", "FastAPI", "Prisma / Drizzle", "PostgreSQL"],
            fuuastCourse: "Enterprise Systems Development",
            semester: "Semester 5",
            projectIdea: "Create a complete REST API for a university internship portal with role-based access control (Student, Admin, Employer).",
            resources: [
              { title: "Roadmap.sh Backend Guide", url: "https://roadmap.sh/backend", type: "doc" },
            ],
          },
        ],
      },
      {
        id: "se-m3",
        stepNumber: 3,
        title: "3. Software Quality Assurance & Testing",
        subtitle: "Automated unit tests, integration testing, and end-to-end user journey validation",
        category: "SQA & Testing",
        nodes: [
          {
            id: "se-testing-pyramid",
            title: "Testing Pyramid: Unit & Integration",
            tag: "core",
            description: "Unit testing pure functions, mocking database calls, integration tests with test containers.",
            details: "Catch bugs before they reach production: write fast, isolated unit tests with Jest/Vitest or PyTest; mock external HTTP dependencies; and test API routes against live ephemeral PostgreSQL test databases.",
            tools: ["Jest / Vitest", "PyTest", "Supertest"],
            fuuastCourse: "Software Quality Assurance (SE-302)",
            semester: "Semester 6",
            projectIdea: "Write a comprehensive automated test suite achieving 90%+ code coverage for an authentication and billing service.",
            resources: [
              { title: "Testing JavaScript by Kent C. Dodds", url: "https://testingjavascript.com/", type: "course" },
            ],
          },
          {
            id: "se-e2e-testing",
            title: "End-to-End (E2E) Testing with Playwright",
            tag: "recommended",
            description: "Simulating real browser interactions, automated smoke tests, visual regression testing.",
            details: "Verify user flows in real headless browsers: automate logins, form submissions, multi-page flows, and file uploads using Playwright to ensure mission-critical user journeys never break.",
            tools: ["Playwright", "Cypress", "GitHub Actions"],
            fuuastCourse: "Software Testing & Verification",
            semester: "Semester 6",
            projectIdea: "Write an automated Playwright test suite that verifies the entire FUUAST student registration workflow.",
            resources: [
              { title: "Playwright Official Documentation", url: "https://playwright.dev/", type: "doc" },
            ],
          },
        ],
      },
      {
        id: "se-m4",
        stepNumber: 4,
        title: "4. DevOps, CI/CD & Cloud Infrastructure",
        subtitle: "Containerization, automated build pipelines, and production cloud deployment",
        category: "DevOps",
        nodes: [
          {
            id: "se-docker",
            title: "Docker & Containerization",
            tag: "core",
            description: "Dockerfiles, multi-stage builds, container networking, volumes, docker-compose.",
            details: "Solve 'it works on my machine' once and for all: package applications and their exact runtime dependencies into lightweight Linux containers with multi-stage builds that produce lean production images.",
            tools: ["Docker", "Docker Compose", "Docker Hub"],
            fuuastCourse: "Cloud Computing & DevOps (SE-401)",
            semester: "Semester 7",
            projectIdea: "Containerize a full-stack Next.js + Node.js API + PostgreSQL stack using a multi-service `docker-compose.yml` file.",
            resources: [
              { title: "Docker Curriculum for Beginners", url: "https://docker-curriculum.com/", type: "doc" },
              { title: "Roadmap.sh DevOps Guide", url: "https://roadmap.sh/devops", type: "doc" },
            ],
          },
          {
            id: "se-cicd",
            title: "CI/CD Pipelines with GitHub Actions",
            tag: "core",
            description: "Automated linting, testing, Docker image building, and automated deployment on git push.",
            details: "Automate delivery: configure GitHub Actions workflows triggered on every pull request that lint code, run automated tests, build Docker containers, and trigger production deployment automatically.",
            tools: ["GitHub Actions", "Docker Buildx", "Hostinger / AWS"],
            fuuastCourse: "Software Project Management",
            semester: "Semester 7",
            projectIdea: "Build a GitHub Actions workflow that automatically runs test suites, builds Next.js, and deploys to production on merge.",
            resources: [
              { title: "GitHub Actions Documentation", url: "https://docs.github.com/en/actions", type: "doc" },
            ],
          },
        ],
      },
      {
        id: "se-m5",
        stepNumber: 5,
        title: "5. Production SRE, Security & FYP Engineering",
        subtitle: "Application monitoring, OWASP Top 10 security, and Final Year Project delivery",
        category: "Production",
        nodes: [
          {
            id: "se-security",
            title: "Software Security & OWASP Top 10",
            tag: "core",
            description: "SQL Injection, Cross-Site Scripting (XSS), CSRF, Rate Limiting, Secrets Management.",
            details: "Defend production web apps against common vulnerabilities: sanitize all SQL and database inputs, configure strict Content Security Policies (CSP), use bcrypt/Argon2 password hashing, and avoid committing API keys.",
            tools: ["OWASP ZAP", "Helmet.js", "Dotenv", "GitGuardian"],
            fuuastCourse: "Information Security & Cryptography",
            semester: "Semester 8",
            projectIdea: "Conduct a comprehensive security audit and vulnerability assessment on a student portal web application.",
            resources: [
              { title: "OWASP Top 10 Security Risks", url: "https://owasp.org/www-project-top-ten/", type: "doc" },
            ],
          },
          {
            id: "se-monitoring",
            title: "Production Observability & APM",
            tag: "recommended",
            description: "Application Performance Monitoring, structured logging, error tracking (Sentry), health checks.",
            details: "Keep production healthy: track 500 errors and user crashes in real-time with Sentry; record structured JSON logs; and monitor server CPU, memory, and database connection pool health.",
            tools: ["Sentry", "Prometheus", "Grafana", "Pino / Winston"],
            fuuastCourse: "Final Year Project (FYP-I & II)",
            semester: "Semester 8",
            projectIdea: "Integrate Sentry error tracking, automated health check endpoints, and Discord alerts into your Final Year Project.",
            resources: [
              { title: "Sentry Documentation", url: "https://docs.sentry.io/", type: "doc" },
            ],
          },
        ],
      },
    ],
  },
};
