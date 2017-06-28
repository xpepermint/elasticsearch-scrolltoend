'use strict';

function scrollToEnd(scroll, handler) {
  let self = this;
  let total = 0;
  let batches = 0;
  let timedOut = false;

  return function(res) {
    let scrollId = res._scroll_id;
    let timedOut = res.timed_out;
    if (timedOut) return Promise.resolve({timedOut, batches, total});

    var hits = res.hits.hits;
    if (hits.length === 0) return Promise.resolve({ timedOut: timedOut, batches: batches, total: total });

    total += hits.length;
    batches += 1;

    return handler(res).then(function (res) {
        return next({ scroll: scroll, scrollId: scrollId, handler: handler });
    });
  };

  function next({scroll, scrollId, handler}) {
    return self.scroll({scroll, scrollId}).then(res => {
      scrollId = res._scroll_id;

      let timedOut = res.timed_out;
      if (timedOut) return Promise.resolve({timedOut, batches, total});

      let hits = res.hits.hits;
      if (hits.length === 0) return Promise.resolve({timedOut, batches, total});

      total+= hits.length;
      batches+= 1;

      return handler(res).then(res => {
        return next({scroll, scrollId, handler});
      });
    });
  }
};

function esPlugin(Client, config, components) {
  Client.prototype.scrollToEnd = scrollToEnd;
}

module.exports = scrollToEnd;
module.exports.plugin = esPlugin;
