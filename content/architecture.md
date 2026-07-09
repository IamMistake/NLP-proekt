# Architecture

**Data Pipeline**

The system uses a filter-style pipeline pattern. A shared `PipelineContext` flows through ordered steps, each reading from and writing back to the context. Every step is isolated in its own module with a clear contract.

### Pipeline Components

1. **KG Generation (kg-gen)** — Entity Extraction, Relation Extraction, Triple Generation, Entity Resolution, Alias Normalization
2. **Question Standardization** — LLM Query Rewrite, Alias Replacement, Entity Linking Against KG
3. **Subgraph Retrieval** — Hybrid / Graph-Only / Corpus-Only Strategies, Triple Scoring, Evidence Subgraph Pruning
4. **Answer Generation** — LLM Reasoning, Provenance-Backed Response, Structured Evidence References
5. **Benchmark Evaluation** — MTRAG Benchmark (Dev 64 / Stable 160 / Smoke 8)

### Artifacts

- `entities.jsonl`, `relations.jsonl`, `triples.jsonl`
- `aliases.jsonl`, `provenance.jsonl`, `metadata.json`
- `networkx` Graph Store
