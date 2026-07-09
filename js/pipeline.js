// ============================================================
// Pipeline diagram — click component legend to show detail
// ============================================================

(function () {
  'use strict';

  var detailEl = document.getElementById('component-detail');
  if (!detailEl) return;

  var components = {
    'kg-gen': {
      title: 'KG Generation (kg-gen)',
      desc: 'Extracts entities, relations, and triples from input text using the kg-gen library. Applies entity resolution and alias normalization to reduce sparsity and produce a consistent, queryable knowledge graph. Supports both OpenAI and DeepSeek as model providers.',
      file: 'src/graphrag_pipeline/steps/kg_gen/'
    },
    standardization: {
      title: 'Question Standardization',
      desc: 'Normalizes the user question via LLM rewrite and alias replacement against the knowledge graph. Links question entities to canonical KG entities for precise retrieval. Ensures that entity references in the query match the KG vocabulary.',
      file: 'src/graphrag_pipeline/steps/standardization/'
    },
    retrieval: {
      title: 'Subgraph Retrieval',
      desc: 'Retrieves a compact evidence subgraph from the KG relevant to the normalized question. Supports three strategies: <strong>hybrid</strong> (graph + corpus), <strong>graph-only</strong>, and <strong>corpus-only</strong>. Features configurable top-k selection, triple scoring, and evidence subgraph pruning.',
      file: 'src/graphrag_pipeline/steps/subgraph_retrieval/'
    },
    answering: {
      title: 'Answer Generation',
      desc: 'Generates an answer with a reasoning trace backed by specific provenance records from the retrieved subgraph. Produces structured evidence references alongside the final answer, enabling transparent and verifiable results.',
      file: 'src/graphrag_pipeline/steps/answering/'
    },
    evaluation: {
      title: 'MTRAG Benchmark Evaluation',
      desc: 'Runs the pipeline against MTRAG benchmark tasks across four domains: ClapNQ, Cloud, FiQA, and Govt. Supports configurable sampling presets (dev64, stable, smoke), retrieval strategies, and judge providers for generation scoring. Metrics include Recall@k and nDCG@k.',
      file: 'src/graphrag_pipeline/steps/evaluation/'
    }
  };

  var legendButtons = document.querySelectorAll('.legend-item');

  legendButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var comp = this.getAttribute('data-component');
      var data = components[comp];
      if (!data) {
        detailEl.innerHTML = '<p class="component-detail-empty">No details available.</p>';
        return;
      }

      var html = '';
      html += '<h3 style="font-size:1.05rem;font-weight:700;margin-bottom:8px;color:var(--rm-ink)">' + data.title + '</h3>';
      html += '<p style="color:var(--rm-sub);font-size:0.9rem;line-height:1.7">' + data.desc + '</p>';
      if (data.file) {
        html += '<p style="margin-top:10px;font-size:0.82rem;color:#94a3b8">';
        html += '<code style="font-family:var(--font-mono)">' + data.file + '</code>';
        html += '</p>';
      }
      detailEl.innerHTML = html;
    });
  });

})();
