# Goodreads Books Integration

## Summary

Add a books section to dreslan.com that houses book reviews, a year-by-year reading log, and a to-read list. Data is imported once from a Goodreads CSV export; the site becomes the source of truth going forward.

## Architecture

### Reviews Collection (`_reviews/`)

A Jekyll collection with `output: true` — each review gets its own page at `/reviews/<slug>/`.

**Frontmatter schema:**

```yaml
---
layout: review
title: "Book Title"
author: "Author Name"
rating: 4          # 1-5 integer
date_read: 2025-08-15
cover: /assets/images/books/cover.jpg  # optional
---

Review body in markdown. Empty body = read but not reviewed.
```

- **Filename convention**: `<slugified-title>.md` — lowercase, hyphens for spaces, no punctuation (e.g., `the-pragmatic-programmer.md`). No date prefix. This keeps permalink behavior predictable since `:title` in the permalink resolves to the filename stem.
- `date_read` enables year-based grouping for the reading log. Must be zero-padded ISO 8601 (`YYYY-MM-DD`) for correct sort order.
- Files with no body content are "read but not reviewed" — they appear in the yearly reading log but not in the reviews section. Detection in Liquid requires `review.content | strip != ""` to handle trailing whitespace.
- Permalink: `/reviews/:title/`

### Reading List (`_data/reading_list.yml`)

A flat YAML list for the to-read shelf:

```yaml
- title: "Book Title"
  author: "Author Name"

- title: "Another Book"
  author: "Another Author"
```

No dates, no ratings — just a simple queue.

### Books Page (`books.md`)

A single root-level page at `/books/` with `layout: page` and `permalink: /books/`. Three sections:

1. **Reviews** — only entries from `_reviews` that have body content, sorted by `date_read` descending. Each item links to its full review page.
2. **Read** — all entries from `_reviews` grouped by year (from `date_read`), most recent year first. Entries with reviews link to their review page; entries without reviews show as plain text.
3. **Reading List** — rendered from `_data/reading_list.yml`. A simple list of title + author.

### Review Layout (`_layouts/review.html`)

Extends `default.html`. Displays:

- Book title (h1)
- Metadata block: author, rating (as `★★★★☆`), date read
- Cover image (if present in frontmatter)
- Review body (markdown content)

Follows the same visual style as `post.html` — metadata in small/mono text above the content.

### Navigation

Add `books` to the header nav in `default.html`, positioned between `projects` and `about`:

```
blog | archive | projects | books | about
```

### Styling

- Books index page follows existing post-list patterns (title links, metadata beneath)
- Review pages match blog post layout
- Rating rendered as plain text stars — no JS, no images
- Year headings in the "Read" section styled like archive.md year headings

## One-Time Import

1. User exports CSV from Goodreads (My Books > Import/Export > Export Library)
2. A script (or manual process) parses the CSV and generates:
   - `_reviews/*.md` files for books on the "read" shelf (with review text if present)
   - `_data/reading_list.yml` entries for books on the "to-read" shelf
3. After import, the CSV is not kept in the repo — the site files are the source of truth

## Configuration Changes

In `_config.yml`, add:

```yaml
collections:
  reviews:
    output: true
    permalink: /reviews/:title/
```

## Future Considerations (Not in Scope)

- Cover images (can be added per-review via frontmatter when desired)
- Search/filter on the books page
- Pagination if the review count grows large
- Goodreads link-back on individual reviews
