# LLM Wiki — Ideas and Architecture

Source: Idea document describing the LLM Wiki pattern.
Author: Original idea document (anonymous)
Date: ~2025
Tags: #llm #knowledge-management #wiki #personal-knowledge-base

## Summary

The LLM Wiki pattern inverts conventional RAG: instead of retrieving chunks from raw documents at query time, the LLM incrementally builds and maintains a persistent wiki of markdown files. Knowledge is compiled once at ingest time and kept current, rather than re-derived on every question.

## Key Concepts

- **Compilation over retrieval**: Knowledge is extracted and integrated into the wiki when a source is added, not pieced together fresh on each query.
- **Persistent, compounding artifact**: The wiki grows richer with every source and every question. Cross-references are pre-built, contradictions flagged, synthesis maintained.
- **Division of labor**: Human curates sources and directs analysis; LLM handles all summarization, cross-referencing, filing, and bookkeeping.
- **Obsidian-as-IDE metaphor**: The LLM is the "programmer" editing markdown files; Obsidian is the "IDE" for browsing, linking, and graph visualization.

## Architecture (3 Layers)

1. **Raw sources** — immutable source documents (articles, papers, etc.). LLM reads but never modifies.
2. **The wiki** — LLM-generated markdown files (summaries, entities, concepts, comparisons). LLM owns this layer.
3. **The schema** — A configuration file (e.g. CLAUDE.md / CLAW.md / AGENTS.md) defining wiki structure, conventions, and workflows.

## Operations

- **Ingest**: Read source → discuss takeaways → write summary → update index → update relevant entity/concept pages → log entry.
- **Query**: Search wiki → read relevant pages → synthesize answer with citations. Valuable answers get filed back as new wiki pages.
- **Lint**: Health-check for contradictions, stale claims, orphan pages, missing cross-references, data gaps.

## Indexing & Logging

- **index.md**: Content-oriented catalog of all wiki pages, organized by category. Updated on every ingest.
- **log.md**: Append-only chronological record with structured prefixes (e.g. `## [date] ingest | Title`).

## Applications

Personal knowledge management, research deep-dives, book companions, team/business wikis, competitive analysis, due diligence, trip planning, course notes, hobby exploration.

## Related Ideas

- Vannevar Bush's **Memex** (1945) — personal knowledge store with associative trails. The LLM solves the maintenance problem that Memex couldn't.

## References

- [[llm-wiki-idea]] (raw source)
