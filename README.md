# [elasticsearch](https://github.com/elastic/elasticsearch-js)-scrolltoend

> Elasticsearch-js client extension for processing scroll results.

This module provides `scrollToEnd` function which allows for processing each batch while scrolling search results.

## Setup

Install the package.

```
npm install --save elasticsearch-scrolltoend
```

Then extend the Elasticsearch API by including this plugin.

```js
'use strict';

const hosts = ['127.0.0.1'];
const apiVersion = '2.x';
const elasticsearch = require('elasticsearch');
const esScrollToEnd = require('elasticsearch-scrolltoend');

const client = new elasticsearch.Client({
  hosts, apiVersion,
  plugins: [ esScrollToEnd.plugin ]
});
```

## Example

Define a function for processing batches.

```js
let batchHandler = function(res) {
  console.log(res);
  return Promise.resolve();
};
```

Start scrolling.

```js
let index = `products`;
let scroll = '60s';
let scrollToEnd = client.scrollToEnd(scroll, batchHandler);
return client.search({index, scroll, search_type: 'scan'}).then(scrollToEnd);
```
