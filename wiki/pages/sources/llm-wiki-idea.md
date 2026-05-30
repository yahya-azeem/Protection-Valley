# Source: LLM Wiki Idea

- **File**: `wiki/raw/llm-wiki-idea.md`
- **Ingested**: 2025 (initial wiki setup)
- **Tags**: #llm #wiki #knowledge-management #pattern

## Summary

This is the founding idea document for the LLM Wiki pattern. It describes a paradigm shift from RAG-based knowledge retrieval (stateless, re-derived on every query) to a persistent wiki maintained by an LLM (knowledge compiled once at ingest, cross-referenced and kept current).

## Key Takeaways

- The wiki is a **persistent, compounding artifact** — it gets richer with every source and question.
- Three-layer architecture: raw sources (immutable) → wiki (LLM-maintained) → schema (conventions).
- Three operations: **Ingest** (add sources), **Query** (ask questions, file answers), **Lint** (health-check).
- The LLM handles all bookkeeping; the human handles curation and direction.
- Index and log files keep the wiki navigable at scale.

## Wiki Pages Created

- [[concepts/llm-wiki]] — main concept page
- This source summary page
