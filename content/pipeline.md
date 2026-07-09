# Pipeline Steps

The default pipeline chains standardization through answering. Each step reads from and writes back to the shared `PipelineContext`.

### 1. KG Generation

Extract entities, relations, and triples from input text using kg-gen. Applies entity resolution and alias normalization to reduce sparsity and produce a consistent knowledge graph.

*kg-gen · OpenAI / DeepSeek*

### 2. Question Standardization

Normalize the user question via LLM rewrite and alias replacement against the KG. Links question entities to canonical KG entities for precise retrieval.

*LLM Rewrite · Entity Linking*

### 3. Subgraph Retrieval

Retrieve a compact evidence subgraph from the KG relevant to the normalized question. Supports hybrid (graph + corpus), graph-only, and corpus-only strategies with configurable top-k selection and pruning.

*Hybrid / Graph / Corpus · Triple Scoring*

### 4. Answer Generation

Generate an answer with a reasoning trace backed by specific provenance records from the retrieved subgraph. Produces structured evidence references alongside the final answer.

*LLM Reasoning · Provenance References*

### 5. Benchmark Evaluation

Run the pipeline against MTRAG benchmark tasks across four domains (ClapNQ, Cloud, FiQA, Govt) with configurable sampling presets, retrieval strategies, and judge providers for generation scoring.

*MTRAG · nDCG / Recall · LLM Judge*
