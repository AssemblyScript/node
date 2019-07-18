![AS](https://avatars1.githubusercontent.com/u/28916798?s=48) node
======================

Implementations of the node.js APIs for AssemblyScript, utilizing [WASI](https://wasi.dev).

Introduction
------------

This library aims to provide a convenient node.js-like environment for AssemblyScript programs.
Please note that it is still in its early stages and that both the library and WASI are not even
close to be finalized.

As always, if the idea sounds appealing to you, feel free to improve existing APIs or to contribute
additional ones.

Instructions
------------

Install the library components as a dependency of your project

```
$> npm install --save-dev AssemblyScript/node
```

and include it in your build step to gain access to the implementations it provides:

```
$> asc --lib ./node_modules/@assemblyscript/node/assembly [...]
```

Doing so will automatically register common globals like the `Buffer` class and enables requiring
for example the filesystem module through `import * as fs from "fs"`.

Documentation
-------------

* [Status and API documentation on the wiki](https://github.com/AssemblyScript/node/wiki)
* [Implementation sources](./assembly)

Building
--------

To run the tests, first make sure that development dependencies are installed, then run:

```
$> npm test
```

One of the dependencies is [node-wasi](https://github.com/devsnek/node-wasi), which is a native
module. If you are running into issues when compiling it (on Windows), make sure that node-wasi
supports your version of node.js, that your machine can build native modules in the first place
and that your version of npm is recent (`npm install npm@latest -g`).
