---
layout: page
title: Books
permalink: /books/
---

## Read

{% assign read_books = site.reviews | where: "status", "read" | sort: "date_read" | reverse %}
{% assign reviews_by_year = read_books | group_by_exp: "review", "review.date_read | date: '%Y'" %}
{% for year in reviews_by_year %}
<h3 class="archive-year">{{ year.name }}</h3>
<ul class="book-list">
  {% for review in year.items %}
  <li>
    <a href="{{ review.url | relative_url }}">{{ review.title }}</a>
    {% assign body = review.content | strip %}{% if body != "" %}<span class="review-badge">reviewed</span>{% endif %}
    <span class="book-list-author">— {{ review.author }}</span>
  </li>
  {% endfor %}
</ul>
{% endfor %}

## Reading List

<ul class="book-list">
{% assign want_to_read = site.reviews | where: "status", "reading-list" %}
{% for book in want_to_read %}
  <li>
    <a href="{{ book.url | relative_url }}">{{ book.title }}</a>
    <span class="book-list-author">— {{ book.author }}</span>
  </li>
{% endfor %}
</ul>
