# Legally - `legally` [![Windows Build](https://img.shields.io/appveyor/ci/franciscop/legally.svg?label=windows)](https://ci.appveyor.com/project/franciscop/legally)

> Disclaimer: I am not a lawyer and this is not legal advice

Discover the license of npm packages that you are using in an easy way:

```bash
npm install legally -g    # Make it work everywhere
legally                   # Check licenses of current directory
legally express           # Check an npm library's licenses
```

It will display first those node_modules' licenses:

![Licenses](images/packages.png)

> `-` means the license couldn't be found and `?` that it was found but couldn't be parsed

And then the license count in your project (different example from the one above):

![License count](images/licenses.png)

Finally, you will get a small report stating whether everything is correct or not:

![License count](images/reports-clear.png)

![License count](images/reports-error.png)

> If you want to understand what the licenses mean, [Elad Nava](https://eladnava.com/) created [tldrlegal](https://github.com/eladnava/tldrlegal) based on `legally`.



## Documentation

> You can use this library programmatically with Node.js as well: [Node.js API](#nodejs-api)

The plain command will perform an analysis in-depth of your installed packages and report everything, and that's likely all that you will need:

```bash
legally
```


### Remote packages

To check a package's license before adding it to your project name it and legally will analyze it. Let's check `express`'s licenses':

```bash
legally express
```

It will take a while since it has to download it and its dependencies and then it will perform the same analysis as if it was the only package in your repository. You can also check many at the same time:

```bash
legally express body-parser formidable
```


### Selective analysis

To show only a part of the analysis, pass the name of the part that you want to show

```bash
# List of packages and their licenses
legally -p
legally --show packages

# Breakdown of what licenses your dependencies have
legally -l
legally --show licenses

# Overview with actionable points
legally -r
legally --show reports
```

You can also combine them with:

```bash
legally -lr   # licenses and reports
legally --show licenses --show reports  # same
```



### Type and filter

You can perform two kind of filters; strict filter (`type`) or soft filter (`filter`) both of them case-insensitive. The **type** will match only those passed literally, while the **filter** will look for the name within the license type:

```bash
legally --type mit  # match "MIT"
legally --filter cc   # match "cc0", "cc-by 3.0", etc
```

You can also combine them

```bash
# Display MIT and BSD family
legally --type mit --filter bsd
```

Or just put several filters

```bash
# Display MIT and BSD families
legally --filter mit --filter bsd
```




### Styles

You can change the style of the table with the `--border` option. Try the `ascii` option if the table is not displayed correctly by default:

```bash
legally --border thin
legally --border bold
legally --border double
legally --border ascii  # This will work in most systems
```

![ASCII style](images/borders.png)

You can use the `--plain` option for output without any [ANSI escape codes](https://en.wikipedia.org/wiki/ANSI_escape_code):

```bash
legally --plain
legally --plain > license-report.txt
```

Lastly, you can also add a width if not all of your licenses are displayed correctly and will adjust it *approximately*. Make sure to adjust your terminal size accordingly. It defaults to `80`:

```bash
legally --width 100
```


## Node.js API

```js
const legally = require('legally');

(async () => {
  const licenses = await legally('express');
  console.log(licenses);
  // {
  //   'accepts@1.3.5': { package: [ 'MIT' ], license: [ 'MIT' ], readme: [] },
  //   'array-flatten@1.1.1': { package: [ 'MIT' ], license: [ 'MIT' ], readme: [] },
  //   ...
  // }
})();
```

Note: to avoid your Node.js process from exiting too early if you copy-paste the above example, [see this StackOverflow answer (by myself)](https://stackoverflow.com/a/50451612/938236):

```js
const legally = require('legally');

var done = (function wait () { if (!done) setTimeout(wait, 1000) })();

(async () => {
  const licenses = await legally('express');
  console.log(licenses);
  // {
  //   'accepts@1.3.5': { package: [ 'MIT' ], license: [ 'MIT' ], readme: [] },
  //   'array-flatten@1.1.1': { package: [ 'MIT' ], license: [ 'MIT' ], readme: [] },
  //   ...
  // }
  done = true;
})();
```

You can put each package with a single license string like `MIT` or `MIT+ISC`:

```js
const legally = require('legally');

const unique = (value, index, self) => self.indexOf(value) === index;
const toStr = lic => [...lic.package, ...lic.license, ...lic.readme].filter(unique).join('+');
const plain = licenses => Object.entries(licenses).reduce((obj, [pack, lic]) => ({
  ...obj, [pack]: toStr(lic)
}), {});

(async () => {
  const licenses = await legally('express');
  console.log(plain(licenses));
  // {
  //   'accepts@1.3.5': 'MIT',
  //   'array-flatten@1.1.1': 'MIT',
  //   ...
  // }
})();
```



## FAQ

**WTF does this license mean?**

There's a service called [TL;DR Legal](https://tldrlegal.com/) that helps you navigate those licenses and [Elad Nava](https://eladnava.com/) created [**tldrlegal**](https://github.com/eladnava/tldrlegal) based on that and built on top of `legally`.


**It says `'No modules installed'`**

Make sure that you are in the root folder for your project; doing `ls` you should be able to see `node_modules`


**I have more licenses than dependencies**

That could happen. While we only account for one license type per project, a project can have (and many do it) several licenses at the same time.

In the Packages table, you can see this is indicated with a `+`. For example, `JSONStream` has these licenses [parsed out of `package.json`](https://github.com/dominictarr/JSONStream/blob/master/package.json#L10): `MIT + Apache 2`


**Does it check all modules by npm?**

Yes, it will check all of the modules in `node_modules` and the nested ones except for folders starting with `.`.


**What licenses does it check?**

It attempts to find Apache, BSD (2 and 3 Clause), CC0, ISC and MIT. It will also attempt to clean existing ones. The list *is* short, so please feel free to expand it adding a new file in `/licenses`:

```js
// File /licenses/mit.js
module.exports.name = 'MIT';
module.exports.regex = /(?:The )?MIT(?: (L|l)icense)/;
module.exports.text = `
  Permission is hereby granted, free of charge, to any person obtaining a copy
  ...
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
`;
module.exports.fragments = module.exports.text.split(/\n\n/);
```
