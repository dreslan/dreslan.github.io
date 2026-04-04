---
layout: page
title: Archive
permalink: /archive/
---
{% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
{% for year in posts_by_year %}
<h2 class="archive-year">{{ year.name }}</h2>
<ul class="post-list">
  {% for post in year.items %}
  <li>
    <span class="post-date">{{ post.date | date: "%b %d" }}</span>
    <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title }}</a>
  </li>
  {% endfor %}
</ul>
{% endfor %}
