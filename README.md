# GraphRAG Pipeline

An end-to-end GraphRAG research pipeline that extracts knowledge graphs from text, retrieves evidence subgraphs, and generates provenance-backed answers — evaluated against the [MTRAG](https://github.com/IBM/mt-rag-benchmark) multi-turn conversational benchmark.

[Overview](#overview) • [Setup](#setup) • [Usage](#usage) • [Pipeline](#pipeline) • [Evaluation](#evaluation)

## Overview

GraphRAG combines knowledge graph construction with retrieval-augmented generation to produce answers grounded in structured evidence. Instead of feeding raw text chunks to an LLM, this pipeline:

1. **Extracts** a knowledge graph from documents using [kg-gen](https://github.com/belindamo/kg-gen) — entities, relations, triples, with entity resolution and alias normalization.
2. **Retrieves** a compact evidence subgraph relevant to the question, controlling context size for the LLM.
3. **Generates** an answer with a reasoning trace backed by specific provenance records.

The pipeline is evaluated on the MTRAG benchmark across four domains (ClapNQ, Cloud, FiQA, Govt) with multi-turn conversational tasks.

## Setup

**Requirements**: Python 3.11+

```bash
python -m venv .venv
source .venv/bin/activate
pip install -U pip
pip install -e '.[dev]'
```

Copy `.env.example` to `.env` and set your API keys:

```env
OPENAI_API_KEY=sk-...
DEEPSEEK_API_KEY=sk-...
MODEL_PROVIDER=openai
MODEL_NAME=gpt-4o-mini
```

> [!NOTE]
> The `kg-gen` dependency pulls in `sentence-transformers` and `scikit-learn` for retrieval helpers. If you only need KG extraction, those are not required at runtime.

## Usage

All commands are exposed through the `graphrag` CLI:

```bash
graphrag --help
```

### Build a Knowledge Graph

From a plain text file:

```bash
graphrag kg-build --input path/to/file.txt
```

From the MTRAG benchmark (passage-corpus mode, per-collection):

```bash
graphrag kg-build-mtrag \
  --mtrag-root mt-rag-benchmark \
  --output-dir data/kg/mtrag_collections \
  --source-mode passage-corpus \
  --split-by-collection \
  --collection fiqa --collection govt \
  --max-passages-per-collection 500 \
  --progress-every 10 --resume
```

### Run the Pipeline

Normalize a question against a KG:

```bash
graphrag normalize --question "What is GraphRAG?" --kg-dir data/kg/example
```

Retrieve an evidence subgraph:

```bash
graphrag retrieve --question "What is GraphRAG?" --kg-dir data/kg/example
```

Generate an answer with reasoning:

```bash
graphrag answer --question "What is GraphRAG?" --kg-dir data/kg/example
```

Run the full pipeline end-to-end:

```bash
graphrag run --question "What is GraphRAG?" --kg-dir data/kg/example
```

### Evaluate Against MTRAG

Smoke test (8 tasks):

```bash
graphrag evaluate \
  --dataset mtrag \
  --mtrag-root mt-rag-benchmark \
  --kg-dir data/kg/mtrag_collections \
  --sample-mode stratified --sample-preset smoke \
  --top-k 8 --run-eval
```

Development run (64 tasks) with progress and desktop notifications:

```bash
graphrag evaluate \
  --dataset mtrag \
  --mtrag-root mt-rag-benchmark \
  --kg-dir data/kg/mtrag_collections \
  --sample-mode stratified --sample-preset dev \
  --top-k 8 --run-eval --progress-every 2 --notify
```

Retrieval-only benchmark (skip generation, compare `lastturn` vs `rewrite` query modes):

```bash
graphrag evaluate \
  --dataset mtrag \
  --mtrag-root mt-rag-benchmark \
  --kg-dir data/kg/mtrag_collections \
  --sample-mode stratified --sample-preset dev \
  --retrieval-benchmark-mode lastturn \
  --skip-generation --run-eval
```

Custom judge model for generation evaluation:

```bash
graphrag evaluate \
  --dataset mtrag \
  --mtrag-root mt-rag-benchmark \
  --kg-dir data/kg/mtrag_collections \
  --sample-mode stratified --sample-preset dev \
  --run-eval \
  --judge-provider auto \
  --judge-model ibm-granite/granite-3.3-8b-instruct
```

## Pipeline

The pipeline uses a filter-style pattern: a shared `PipelineContext` flows through ordered steps, each reading from and writing back to the context.

| Step | Responsibility |
|---|---|
| `kg_gen` | Extract entities, relations, and triples from text using `kg-gen`. Persist as JSONL artifacts. |
| `standardization` | Normalize the user question via LLM rewrite + alias replacement against the KG. |
| `subgraph_retrieval` | Retrieve a compact evidence subgraph from the KG for the normalized question. |
| `answering` | Generate an answer and reasoning trace from the subgraph with provenance references. |
| `evaluation` | Run the pipeline against MTRAG benchmark tasks and emit prediction files. |

The default runner chains `standardization → subgraph_retrieval → answering`. The `evaluation` step runs separately for benchmark experiments.

### Context Model

`PipelineContext` carries the question, normalized form, linked entities, retrieved subgraph, answer, reasoning, provenance records, and the `networkx` graph handle — all typed with Pydantic models.

### Artifacts

KG builds produce these files under `data/kg/<name>/`:

- `entities.jsonl` — canonical entities with aliases
- `relations.jsonl` — canonical relations with aliases
- `triples.jsonl` — head-relation-tail triples with provenance links
- `aliases.jsonl` — alias-to-canonical mappings
- `provenance.jsonl` — source passage/doc references
- `metadata.json` — build summary

## Evaluation

The pipeline is evaluated against the [MTRAG benchmark](https://github.com/IBM/mt-rag-benchmark), a multi-turn conversational benchmark with 842 tasks across four domains.

### Sampling Presets

| Preset | Tasks | Use case |
|---|---|---|
| `smoke` | 8 | Quick sanity check |
| `dev` | 64 | Development iteration |
| `stable` | 160 | Reliable signal |

### Retrieval Strategies

- `hybrid` — graph + corpus retrieval (default)
- `graph` — graph-only retrieval
- `corpus` — corpus-only retrieval

### Benchmark Modes

- `lastturn` — use only the last user turn as the retrieval query
- `rewrite` — use the benchmark-provided standalone question rewrite

### Judge Providers

Generation quality is scored by an LLM judge. Supported providers: `auto`, `openai`, `hf` (HuggingFace), `vllm`.

## Project Structure

```text
configs/                 Model and pipeline configuration (YAML)
data/                    KG artifacts, run outputs, evaluation assets
docs/                    Architecture and pipeline notes
scripts/                 Bootstrap and inspection helpers
src/graphrag_pipeline/   Main Python package
  pipeline/              Runner, registry, base step contract
  steps/
    kg_gen/              KG extraction (kg-gen integration)
    standardization/     Question normalization
    subgraph_retrieval/  Evidence subgraph retrieval
    answering/           Answer generation + reasoning
    evaluation/          MTRAG benchmark adapter
  graph/                 Graph models, builder, NetworkX store, I/O
  llm/                   LLM client, providers, prompts
tests/                   Test suite
study-paper/             Research notes and benchmark comparisons
```

## Development

```bash
# Lint
ruff check .

# Format check
ruff format --check .

# Format
ruff format .

# Run all tests
pytest

# Run specific test file
pytest tests/test_pipeline_runner.py
```