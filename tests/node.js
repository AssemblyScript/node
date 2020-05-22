const { TestContext, VerboseReporter } = require("@as-pect/core");
const glob = require("glob");
const { instantiateSync } = require("assemblyscript/lib/loader");
const { main } = require("assemblyscript/cli/asc");
const { parse } = require("assemblyscript/cli/util/options");
const path = require("path");
const fs = require("fs").promises;
const { WASI } = require("wasi");

const promises = [];
let pass = true;

const options = parse(process.argv.slice(2), {
  "help": {
    "description": "Prints this message and exits.",
    "type": "b",
    "alias": "h"
  },
  "updateFixtures": {
    "description": "Update the test fixtures.",
    "type": "b",
    "alias": "u"
  },
});

if (options.unknown.length > 1) {
  console.error("Unknown options arguments: " + options.unknown.join(" "));
  process.exit(1);
}

const reporter = new VerboseReporter();
reporter.stderr = process.stderr;
reporter.stdout = process.stdout;

function relativeFromCwd(location) {
  return path.relative(process.cwd(), location);
}

const ascOptions = [
  relativeFromCwd(require.resolve("@as-pect/assembly/assembly/index.ts")),
  "--use", "ASC_RTRACE=1",
  "--explicitStart",
  "--measure",
  "--lib", "assembly",
  "--transform", require.resolve("@as-pect/core/lib/transform/index.js"),
];

const files = glob.sync("tests/**/*.spec.ts")
  .map(relativeFromCwd);

const untouchedBinaryMap = new Map();
const optimizedBinaryMap = new Map();

const untouchedWatMap = new Map();
const optimizedWatMap = new Map();

const untouchedAscOptions = {
  writeFile(name, contents) {
    const ext = path.extname(name);
    if (ext === ".wasm") untouchedBinaryMap.set(name, contents);
    if (ext === ".wat") untouchedWatMap.set(name, contents);
  }
};

const optimizedAscOptions = {
  writeFile(name, contents) {
    const ext = path.extname(name);
    if (ext === ".wasm") optimizedBinaryMap.set(name, contents);
    if (ext === ".wat") optimizedWatMap.set(name, contents);
  }
};

const errors = [];

for (const file of files) {
  const ext = path.extname(file);
  const wasmFileName = path.join(path.dirname(file), path.basename(file, ext)) + ".wasm";
  const watFileName = path.join(path.dirname(file), path.basename(file, ext)) + ".wat";

  const cliOptions = ascOptions.concat([
    file,
    "--binaryFile", wasmFileName,
    "--textFile", watFileName,
  ]);

  process.stdout.write("Test File : " + file + " (untouched)\n");
  main(cliOptions.concat(["--debug"]), untouchedAscOptions, (err) => {
    if (err) {
      console.error(err);
      errors.push(err);
    } else {
      const binary = untouchedBinaryMap.get(wasmFileName);
      const wat = untouchedWatMap.get(watFileName);
      runTest(file, "untouched", binary, wat);
    }
  });

  process.stdout.write("\n");
  process.stdout.write("Test File : " + file + " (optimized)\n");
  main(cliOptions.concat(["-O3"]), optimizedAscOptions, (err) => {
    if (err) {
      console.error(err);
      errors.push(err);
    } else {
      const binary = optimizedBinaryMap.get(wasmFileName);
      const wat = optimizedWatMap.get(watFileName);
      runTest(file, "optimized", binary, wat);
    }
  });

  process.stdout.write("\n");
}

function runTest(fileName, type, binary, wat) {
  const dirname = path.dirname(fileName);
  const basename = path.basename(fileName, ".ts");
  const fullName = path.join(dirname, basename)
  const watPath = `${fullName}.${type}.wat`;
  const fileNamePath = `${fullName}.${type}.ts`;

  // should not block testing
  promises.push(fs.writeFile(watPath, wat));

  const wasi = new WASI({
    args: [],
    env: process.env,
    preopens: {
      './tests/sandbox': './tests/sandbox'
    }
  });

  const context = new TestContext({
    fileName: fileNamePath, // set the fileName
    reporter, // use verbose reporter
    binary, // pass the binary to get function names
    wasi,
  });

  const imports = context.createImports({
    wasi_snapshot_preview1: wasi.wasiImport,
  });

  const instance = instantiateSync(binary, imports);

  process.stdout.write("\n");
  context.run(instance);

  if (!context.pass) pass = false;
}

// await for all the file writes to occur for the wat files
Promise.all(promises)
  .then(() => {
    // if the file writes were successful, inspect errors and pass
    process.exit(pass && errors.length === 0 ? 0 : 1);
  })
  .catch((error) => {
    // report the file write error and exit 1
    console.error(error);
    process.exit(1);
  });

