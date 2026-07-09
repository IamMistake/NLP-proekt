# Overview

**Abstract**

Large language models hallucinate, have limited context windows, and suffer from the "lost-in-the-middle" problem when context grows large. Standard RAG approaches return text fragments without explicitly representing the relationships between facts.

**GraphRAG Pipeline** solves this by combining knowledge graph construction with retrieval-augmented generation. Instead of feeding raw text chunks to an LLM, the pipeline extracts a structured knowledge graph from documents, retrieves a compact evidence subgraph relevant to the question, and generates an answer with a reasoning trace backed by specific provenance records.

The system is evaluated against the MTRAG multi-turn conversational benchmark across four domains: ClapNQ, Cloud, FiQA, and Govt.

### Key Stats

- **4** Benchmark Domains
- **64** Dev Evaluation Tasks
- **5** Pipeline Steps
- **3** Retrieval Strategies
