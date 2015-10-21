'use strict';

module.exports = function(scroll, fn) {
  let self = this;
  let totalHits = 0;
  let totalBatches = 0;
  let timedOut = false;

  return function(res) {
    let scrollId = res._scroll_id;
    let timedOut = res._timed_out;
    if (timedOut) return Promise.resolve({timedOut, totalBatches, totalHits});

    return next({scroll, scrollId, fn});
  };

  function next({scroll, scrollId, fn}) {
    return self.scroll({scroll, scrollId}).then(res => {
      scrollId = res._scroll_id;

      let timedOut = res._timed_out;
      if (timedOut) return Promise.resolve({timedOut, totalBatches, totalHits});

      let hits = res.hits.hits;
      if (hits.length === 0) return Promise.resolve({timedOut, totalBatches, totalHits});

      totalHits+= hits.length;
      totalBatches+= 1;

      return fn(res).then(res => {
        return next({scroll, scrollId, fn});
      });
    });
  }
};
