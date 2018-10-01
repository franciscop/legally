const legally = require('./');

var done = (function wait () { if (!done) setTimeout(wait, 1000) })();

(async () => {
  try {
    const licenses = await legally('express');
    console.log(licenses);
    // {
    //   'accepts@1.3.5': { package: [ 'MIT' ], license: [ 'MIT' ], readme: [] },
    //   'array-flatten@1.1.1': { package: [ 'MIT' ], license: [ 'MIT' ], readme: [] },
    //   ...
    // }

    // This should not fail
    await legally('baconjs');
  } finally {
    done = true;
  }
})();
