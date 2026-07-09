# Results

**Evaluation**

Retrieval evaluation on the MTRAG benchmark (dev64 sample, weighted across all four domains). The pipeline's hybrid retrieval strategy achieves BM25-competitive performance, with the `lastturn` query mode outperforming `rewrite` on this setup.

### Lastturn — Our Pipeline

| Metric | @1 | @3 | @5 |
|--------|----|----|----|
| Recall | 0.085 | 0.196 | **0.219** |
| nDCG   | **0.172** | 0.193 | **0.198** |

### Rewrite — Our Pipeline

| Metric | @1 | @3 | @5 |
|--------|----|----|----|
| Recall | 0.097 | 0.174 | 0.209 |
| nDCG   | 0.172 | 0.178 | 0.191 |

### Comparison vs MTRAG Baselines (Lastturn)

Our pipeline achieves BM25-competitive retrieval: above BM25 at @1/@3/@5 for both Recall and nDCG in lastturn mode. Results are from a dev64 sample with KG capped at 1,000 passages per collection. Full-corpus KG builds and generation evaluation are in progress for the next milestone.

| System | R@5 |
|--------|-----|
| Our Pipeline (Lastturn) | 0.219 |
| BM25 (Lastturn) | 0.20 |
| BGE-base 1.5 (Lastturn) | 0.30 |
| Elser (Lastturn) | 0.49 |
