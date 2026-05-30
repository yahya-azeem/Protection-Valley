# CLAW.md — Wiki Schema for Protection Valley

This file defines how the wiki works. I (the LLM) follow these conventions when ingesting sources, answering queries, and maintaining the wiki.

## Directory Structure

```
wiki/
├── CLAW.md              # This file — schema and conventions
├── index.md             # Content-oriented catalog (updated on every ingest)
├── log.md               # Chronological record (append-only, structured prefixes)
├── raw/                 # Immutable source documents (LLM reads, never writes)
│   ├── assets/          # Local images / attachments
│   └── ...
├── pages/               # LLM-generated wiki pages
│   ├── concepts/        # Topic/concept pages (e.g. llm-wiki.md)
│   ├── entities/        # Entity pages (people, places, organizations, etc.)
│   └── sources/         # Source summary pages (one per raw document)
```

## Page Format

Every wiki page should follow this structure:

```markdown
# Title

Source: [where this info comes from]
Tags: #tag1 #tag2

## Summary

[2-4 sentence summary]

## Body

[markdown content with headings, lists, links to other wiki pages]

## References

- [[related-page-name]] — description
- [external link](url)
```

### Source summary pages (`pages/sources/`) follow this format:

```markdown
# Source: Source Title

- **File**: `wiki/raw/filename.md`
- **Ingested**: YYYY-MM-DD
- **Tags**: #tag1 #tag2

## Summary

[2-4 sentence summary of the source]

## Key Takeaways

- [takeaway 1]
- [takeaway 2]

## Wiki Pages Created/Updated

- [[concepts/topic]] — description
- [[entities/thing]] — description
```

## Cross-References

- Link between wiki pages using Obsidian-style `[[page-name]]` syntax (minus the `.md`).
- Source summary pages should link to the concept/entity pages they feed into.
- Concept pages should link back to source summaries via `[[sources/source-name]]`.
- Entity pages should link to relevant concepts and sources.
- When updating a page, always check and update cross-references on related pages.

## Operations

### Ingest

When the user asks me to ingest a new source:

1. Read the raw source file from `wiki/raw/`.
2. Discuss key takeaways with the user — confirm emphasis and approach.
3. Create/update the source summary page at `wiki/pages/sources/`.
4. Create or update concept and entity pages in `wiki/pages/concepts/` and `wiki/pages/entities/`.
5. Update `wiki/index.md` — add new pages, update descriptions.
6. Append an entry to `wiki/log.md`.
7. Confirm to the user what was done and what changed.

A single source may touch 10-15 pages. Do the full pass.

### Query

When the user asks a question:

1. Read `wiki/index.md` to identify relevant pages.
2. Read the relevant pages.
3. Synthesize an answer with citations to wiki pages.
4. If the answer is valuable enough to keep, offer to file it as a new wiki page.

### Lint

When the user asks for a health-check:

1. Scan all pages for: contradictions, stale claims, orphan pages, missing cross-references, gaps.
2. Check that `index.md` is complete and up to date.
3. Suggest new sources or questions to pursue.
4. Report findings and offer to fix discovered issues.

## Index Maintenance

- `index.md` is organized by category (Concepts, Entities, Sources).
- Every page gets an entry with a one-line description.
- Update on every ingest. Keep descriptions concise.

## Log Conventions

Every log entry starts with:
```
## [YYYY-MM-DD] <operation> | <Title>
```

Operations: `ingest`, `query`, `lint`, `update`, `create`.

This format is grep-friendly: `grep "^## \[" wiki/log.md | tail -5`

## Guiding Principles

- **The wiki compounds.** Every source and question should leave the wiki richer than before.
- **The LLM does the grunt work.** I handle all summarization, cross-referencing, updating, and bookkeeping.
- **Edits are surgical.** When updating existing pages, preserve existing content that's still accurate. Add, revise, and cross-reference — don't rewrite from scratch unless the page is small and the change is total.
- **Contradictions get flagged, not hidden.** If a new source contradicts an existing claim, note the contradiction explicitly on the relevant page(s).
- **Good answers become pages.** If the user asks something that produces a valuable synthesis, file it.
- **Keep it navigable.** Links, links, links. A wiki page with no outbound links is a dead end.

## Tools

- `wiki/raw/assets/` — for locally-downloaded images referenced in source documents.
- `grep` for searching page content. `grep -r "pattern" wiki/pages/`.
- The index is the primary navigation tool. At larger scale, consider adding a search tool.
