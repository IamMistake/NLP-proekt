# Setup & Usage

## Getting Started

### Requirements

Python 3.11+

```bash
python -m venv .venv
source .venv/bin/activate
pip install -U pip
pip install -e '.[dev]'
```

### Configuration

Set your API keys in `.env`:

```env
OPENAI_API_KEY=sk-...
DEEPSEEK_API_KEY=sk-...
MODEL_PROVIDER=openai
MODEL_NAME=gpt-4o-mini
```

## CLI Commands

All commands are exposed through the `graphrag` CLI, built with Typer.

### Build a Knowledge Graph

```bash
graphrag kg-build --input path/to/file.txt
```

Extract entities, relations, and triples from a plain text file.

### Build from MTRAG

```bash
graphrag kg-build-mtrag \
  --mtrag-root mt-rag-benchmark \
  --output-dir data/kg/mtrag_collections \
  --source-mode passage-corpus \
  --split-by-collection \
  --collection fiqa --collection govt \
  --max-passages-per-collection 500
```

### Normalize a Question

```bash
graphrag normalize \
  --question "What is GraphRAG?" \
  --kg-dir data/kg/example
```

### Retrieve Subgraph

```bash
graphrag retrieve \
  --question "What is GraphRAG?" \
  --kg-dir data/kg/example
```

### Generate Answer

```bash
graphrag answer \
  --question "What is GraphRAG?" \
  --kg-dir data/kg/example
```

### Full Pipeline

```bash
graphrag run \
  --question "What is GraphRAG?" \
  --kg-dir data/kg/example
```
