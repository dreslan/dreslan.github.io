---
layout: page
title: Books
permalink: /books/
---

## Read

{% assign read_books = site.reviews | where: "status", "read" %}
{% assign reviews_by_year = read_books | group_by_exp: "review", "review.date_read | date: '%Y'" | sort: "name" | reverse %}
{% for year in reviews_by_year %}
<h3 class="archive-year">{{ year.name }}</h3>
<div class="book-shelf">
  {% for review in year.items %}
  <a href="{{ review.url | relative_url }}" class="book-card">
    {% if review.cover %}<img src="{{ review.cover | relative_url }}" alt="" class="book-card-cover">{% else %}<div class="book-card-cover book-card-no-cover">{{ review.title | truncate: 30 }}</div>{% endif %}
    <div class="book-card-info">
      <span class="book-card-title">{{ review.title }}</span>
      <span class="book-card-author">{{ review.author }}</span>
      {% assign body = review.content | strip %}{% if body != "" %}<span class="review-badge">reviewed</span>{% endif %}
      {% if review.description %}<p class="book-card-desc">{{ review.description | truncate: 120 }}</p>{% endif %}
    </div>
  </a>
  {% endfor %}
</div>
{% endfor %}

## Reading List

<div class="book-shelf">
{% assign want_to_read = site.reviews | where: "status", "reading-list" %}
{% for book in want_to_read %}
  <a href="{{ book.url | relative_url }}" class="book-card">
    {% if book.cover %}<img src="{{ book.cover | relative_url }}" alt="" class="book-card-cover">{% else %}<div class="book-card-cover book-card-no-cover">{{ book.title | truncate: 30 }}</div>{% endif %}
    <div class="book-card-info">
      <span class="book-card-title">{{ book.title }}</span>
      <span class="book-card-author">{{ book.author }}</span>
      {% if book.description %}<p class="book-card-desc">{{ book.description | truncate: 120 }}</p>{% endif %}
    </div>
  </a>
{% endfor %}
</div>
