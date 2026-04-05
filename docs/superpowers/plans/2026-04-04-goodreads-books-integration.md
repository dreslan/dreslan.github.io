# Goodreads Books Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a books section to dreslan.com with reviews, a yearly reading log, and a to-read list — seeded from a Goodreads CSV export.

**Architecture:** A Jekyll `_reviews` collection with `output: true` for individual review pages, a `_data/reading_list.yml` for the to-read shelf, and a `books.md` index page with three sections (reviews, read-by-year, reading list). A one-time Python import script converts the Goodreads CSV into these files.

**Tech Stack:** Jekyll 4.3, Liquid templates, Python 3 (import script only)

---

## File Structure

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `_config.yml` | Add `collections.reviews` with `output: true` and permalink |
| Create | `_layouts/review.html` | Individual review page layout (extends `default.html`) |
| Create | `books.md` | Books index page with reviews, read-by-year, and reading list sections |
| Modify | `_layouts/default.html:22-24` | Add `books` nav link between `projects` and `about` |
| Create | `_data/reading_list.yml` | To-read shelf data |
| Create | `_reviews/sample-book.md` | Scaffold review to verify collection works (deleted after import) |
| Create | `scripts/import_goodreads.py` | One-time CSV-to-Jekyll converter |

---

### Task 1: Configure the Reviews Collection

**Files:**
- Modify: `_config.yml`

- [ ] **Step 1: Add the collections config**

Add the following block to `_config.yml` after the `plugins` block:

```yaml
collections:
  reviews:
    output: true
    permalink: /reviews/:title/
```

- [ ] **Step 2: Verify the build still works**

Run: `cd /Users/dreslan/repos/dreslan/dreslan.github.io && bundle exec jekyll build 2>&1 | tail -5`

Expected: Build succeeds with no errors. The `_reviews` collection is now registered even though the directory doesn't exist yet.

- [ ] **Step 3: Commit**

```bash
git add _config.yml
git commit -m "feat: add reviews collection to Jekyll config"
```

---

### Task 2: Create the Review Layout

**Files:**
- Create: `_layouts/review.html`

- [ ] **Step 1: Create `_layouts/review.html`**

This layout extends `default.html` and mirrors the structure of `post.html` (article wrapper, h1 title, metadata block, content). It adds book-specific metadata: author, star rating, and date read.

```html
---
layout: default
---
<article class="post">
  <header class="post-header">
    <h1>{{ page.title }}</h1>
    <span class="review-meta">
      {{ page.author }}
      · {% assign full = page.rating | round %}{% for i in (1..5) %}{% if i <= full %}★{% else %}☆{% endif %}{% endfor %}
      · {{ page.date_read | date: "%b %d, %Y" }}
    </span>
  </header>
  {% if page.cover %}
  <img src="{{ page.cover | relative_url }}" alt="Cover of {{ page.title }}" class="review-cover">
  {% endif %}
  <div class="post-content">
    {{ content }}
  </div>
</article>
```

- [ ] **Step 2: Create a scaffold review to test the layout**

Create `_reviews/sample-book.md`:

```markdown
---
layout: review
title: "Sample Book"
author: "Sample Author"
rating: 4
date_read: 2025-01-15
---

This is a test review to verify the layout renders correctly.
```

- [ ] **Step 3: Build and verify the review page is generated**

Run: `cd /Users/dreslan/repos/dreslan/dreslan.github.io && bundle exec jekyll build 2>&1 | tail -5 && cat _site/reviews/sample-book/index.html | head -40`

Expected: Build succeeds. The output HTML contains the article with "Sample Book" as h1, "Sample Author · ★★★★☆ · Jan 15, 2025" in the metadata, and "This is a test review" in the content.

- [ ] **Step 4: Commit**

```bash
git add _layouts/review.html _reviews/sample-book.md
git commit -m "feat: add review layout and scaffold review"
```

---

### Task 3: Create the Books Index Page

**Files:**
- Create: `books.md`
- Create: `_data/reading_list.yml`

- [ ] **Step 1: Create the reading list data file**

Create `_data/reading_list.yml`:

```yaml
- title: "Sample Future Read"
  author: "Some Author"
```

- [ ] **Step 2: Create `books.md`**

This page has three sections. The Reviews section filters to reviews with body content. The Read section groups all reviews by year. The Reading List section renders from the data file.

```markdown
---
layout: page
title: Books
permalink: /books/
---

## Reviews

<ul class="post-list">
{% assign reviewed = site.reviews | sort: "date_read" | reverse %}
{% for review in reviewed %}
  {% assign body = review.content | strip %}
  {% if body != "" %}
  <li>
    <span class="post-date">{{ review.date_read | date: "%b %d, %Y" }}</span>
    <a class="post-link" href="{{ review.url | relative_url }}">{{ review.title }}</a>
    <span class="review-list-meta">— {{ review.author }} · {% assign full = review.rating | round %}{% for i in (1..5) %}{% if i <= full %}★{% else %}☆{% endif %}{% endfor %}</span>
  </li>
  {% endif %}
{% endfor %}
</ul>

## Read

{% assign reviews_by_year = site.reviews | sort: "date_read" | reverse | group_by_exp: "review", "review.date_read | date: '%Y'" %}
{% for year in reviews_by_year %}
<h3 class="archive-year">{{ year.name }}</h3>
<ul class="book-list">
  {% for review in year.items %}
  <li>
    {% assign body = review.content | strip %}
    {% if body != "" %}<a href="{{ review.url | relative_url }}">{{ review.title }}</a>{% else %}{{ review.title }}{% endif %}
    <span class="book-list-author">— {{ review.author }}</span>
  </li>
  {% endfor %}
</ul>
{% endfor %}

## Reading List

<ul class="book-list">
{% for book in site.data.reading_list %}
  <li>{{ book.title }} <span class="book-list-author">— {{ book.author }}</span></li>
{% endfor %}
</ul>
```

- [ ] **Step 3: Build and verify the books page**

Run: `cd /Users/dreslan/repos/dreslan/dreslan.github.io && bundle exec jekyll build 2>&1 | tail -5 && cat _site/books/index.html | head -60`

Expected: Build succeeds. The output contains three sections: "Reviews" with the sample book linked, "Read" with a 2025 year heading and "Sample Book", and "Reading List" with "Sample Future Read".

- [ ] **Step 4: Commit**

```bash
git add books.md _data/reading_list.yml
git commit -m "feat: add books index page and reading list data file"
```

---

### Task 4: Add Navigation Link and Styling

**Files:**
- Modify: `_layouts/default.html:22-24`
- Modify: `assets/css/style.css`

- [ ] **Step 1: Add the books nav link**

In `_layouts/default.html`, add the `books` link between the `projects` and `about` links. The nav section (lines 22-25) should become:

```html
        <a href="{{ '/' | relative_url }}">blog</a>
        <a href="{{ '/archive' | relative_url }}">archive</a>
        <a href="{{ '/projects' | relative_url }}">projects</a>
        <a href="{{ '/books' | relative_url }}">books</a>
        <a href="{{ '/about' | relative_url }}">about</a>
```

- [ ] **Step 2: Add CSS for book-specific elements**

Append the following to `assets/css/style.css`, before the `/* ── Responsive ── */` section:

```css
/* ── Books ── */
.review-meta {
  font-size: 0.85rem;
  color: var(--text-muted);
  display: block;
}

.review-cover {
  max-width: 200px;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}

.review-list-meta {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.book-list {
  list-style: none;
  margin-bottom: 1.5rem;
}

.book-list li {
  margin-bottom: 0.4rem;
}

.book-list-author {
  font-size: 0.85rem;
  color: var(--text-muted);
}
```

- [ ] **Step 3: Build and verify nav and styles**

Run: `cd /Users/dreslan/repos/dreslan/dreslan.github.io && bundle exec jekyll build 2>&1 | tail -5`

Expected: Build succeeds. Verify the nav link appears in any output page:

Run: `grep -o 'books' /Users/dreslan/repos/dreslan/dreslan.github.io/_site/index.html | head -1`

Expected: `books`

- [ ] **Step 4: Commit**

```bash
git add _layouts/default.html assets/css/style.css
git commit -m "feat: add books nav link and book-specific CSS"
```

---

### Task 5: Write the Goodreads Import Script

**Files:**
- Create: `scripts/import_goodreads.py`

- [ ] **Step 1: Create the import script**

This script reads a Goodreads CSV export and generates `_reviews/*.md` files and `_data/reading_list.yml`. It uses only the Python standard library.

Create `scripts/import_goodreads.py`:

```python
#!/usr/bin/env python3
"""One-time import of Goodreads CSV export into Jekyll _reviews/ and _data/reading_list.yml."""

import csv
import re
import sys
from pathlib import Path


def slugify(title: str) -> str:
    """Convert a book title to a URL-safe filename slug."""
    slug = title.lower()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[\s_]+", "-", slug)
    slug = re.sub(r"-+", "-", slug)
    return slug.strip("-")


def star_rating(rating_str: str) -> int:
    """Parse rating string to int, defaulting to 0 if missing."""
    try:
        return int(rating_str)
    except (ValueError, TypeError):
        return 0


def build_review(row: dict) -> str:
    """Build a Jekyll review markdown file from a Goodreads CSV row."""
    title = row.get("Title", "").strip()
    author = row.get("Author", "").strip()
    rating = star_rating(row.get("My Rating", "0"))
    date_read = row.get("Date Read", "").strip()
    review_text = row.get("My Review", "").strip()

    # Goodreads uses YYYY/MM/DD — convert to YYYY-MM-DD
    if date_read:
        date_read = date_read.replace("/", "-")
    else:
        # Fall back to Date Added if no Date Read
        date_added = row.get("Date Added", "").strip()
        date_read = date_added.replace("/", "-") if date_added else "1970-01-01"

    frontmatter = f"""---
layout: review
title: "{title.replace('"', '\\"')}"
author: "{author.replace('"', '\\"')}"
rating: {rating}
date_read: {date_read}
---"""

    if review_text:
        return f"{frontmatter}\n\n{review_text}\n"
    return f"{frontmatter}\n"


def main() -> None:
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <goodreads_export.csv>", file=sys.stderr)
        sys.exit(1)

    csv_path = Path(sys.argv[1])
    if not csv_path.exists():
        print(f"File not found: {csv_path}", file=sys.stderr)
        sys.exit(1)

    repo_root = Path(__file__).resolve().parent.parent
    reviews_dir = repo_root / "_reviews"
    data_dir = repo_root / "_data"
    reviews_dir.mkdir(exist_ok=True)
    data_dir.mkdir(exist_ok=True)

    reading_list: list[dict[str, str]] = []
    review_count = 0
    read_count = 0

    with csv_path.open(encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            title = row.get("Title", "").strip()
            author = row.get("Author", "").strip()
            shelf = row.get("Exclusive Shelf", "").strip()

            if not title:
                continue

            if shelf == "to-read":
                reading_list.append({"title": title, "author": author})
                continue

            if shelf == "read":
                slug = slugify(title)
                review_path = reviews_dir / f"{slug}.md"

                # Handle duplicate slugs
                counter = 2
                while review_path.exists():
                    review_path = reviews_dir / f"{slug}-{counter}.md"
                    counter += 1

                review_path.write_text(build_review(row), encoding="utf-8")
                review_count += 1

                if row.get("My Review", "").strip():
                    read_count += 1

    # Write reading list YAML
    reading_list_path = data_dir / "reading_list.yml"
    with reading_list_path.open("w", encoding="utf-8") as f:
        for book in reading_list:
            title = book["title"].replace('"', '\\"')
            author = book["author"].replace('"', '\\"')
            f.write(f'- title: "{title}"\n  author: "{author}"\n\n')

    print(f"Imported {review_count} books to _reviews/ ({read_count} with reviews)")
    print(f"Imported {len(reading_list)} books to _data/reading_list.yml")


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Make the script executable**

Run: `chmod +x /Users/dreslan/repos/dreslan/dreslan.github.io/scripts/import_goodreads.py`

- [ ] **Step 3: Commit the script**

```bash
git add scripts/import_goodreads.py
git commit -m "feat: add one-time Goodreads CSV import script"
```

---

### Task 6: Run the Import and Clean Up

**Files:**
- Modify: `_reviews/` (generated files)
- Modify: `_data/reading_list.yml` (overwritten by import)
- Delete: `_reviews/sample-book.md` (scaffold)

This task is interactive — it requires the user to provide their Goodreads CSV export.

- [ ] **Step 1: Get the Goodreads CSV from the user**

Ask the user for the path to their exported Goodreads CSV file. They can export it from Goodreads at: My Books > Import/Export > Export Library.

- [ ] **Step 2: Run the import script**

Run: `cd /Users/dreslan/repos/dreslan/dreslan.github.io && python3 scripts/import_goodreads.py <path-to-csv>`

Expected: Output showing how many books were imported to `_reviews/` and `_data/reading_list.yml`.

- [ ] **Step 3: Delete the scaffold review**

Run: `rm /Users/dreslan/repos/dreslan/dreslan.github.io/_reviews/sample-book.md`

- [ ] **Step 4: Build and verify everything renders**

Run: `cd /Users/dreslan/repos/dreslan/dreslan.github.io && bundle exec jekyll build 2>&1 | tail -5`

Expected: Build succeeds with no errors. Verify the books page has real content:

Run: `cat /Users/dreslan/repos/dreslan/dreslan.github.io/_site/books/index.html | head -80`

- [ ] **Step 5: Commit the imported data**

```bash
git add _reviews/ _data/reading_list.yml
git rm _reviews/sample-book.md 2>/dev/null; true
git commit -m "feat: import books from Goodreads"
```

- [ ] **Step 6: Exclude the import script from the Jekyll build**

Add `scripts` to the `exclude` list in `_config.yml`:

```yaml
exclude:
  - Gemfile
  - Gemfile.lock
  - README.md
  - vendor
  - scripts
```

```bash
git add _config.yml
git commit -m "chore: exclude scripts directory from Jekyll build"
```
