# IANAL

> Note: I am not a lawyer and this is not legal advice

Discover the license of the packages that you are using easily:

![Licenses](licenses.png)

Just install it globally and run it in your repository:

```bash
npm install ianal -g && ianal
```

## Documentation

There are few flags that show extra information. These start by **`?`** and are shown instead of the license name:

`?none`: the file where we are trying to locate the license couldn't be found, or the license itself couldn't be found.

`?verify`: the license file *was* found and there's strong suggestions that there might be a license, but we just couldn't pare it automatically.

`?multiple` [not yet]: there are several licenses in this file/module.




## FAQ

It says `'No modules installed'`

Make sure that you are in the root folder for your project; doing `ls` you should be able to see `node_modules`



Does it check all modules by npm?

Not exactly, it does check all of the modules in `node_modules` except those that start by `.`, but it doesn't go deep checking sub-modules


