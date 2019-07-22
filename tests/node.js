const { TestContext, EmptyReporter } = require("@as-pect/core");
const { instantiateBuffer } = require("assemblyscript/lib/loader");
const glob = require("glob");
const { main } = require("assemblyscript/cli/asc");
const { parse } = require("assemblyscript/cli/util/options");
const path = require("path");
const fs = require("fs");
const Wasi = require("wasi");
const wasi = new Wasi({});
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

class Reporter extends EmptyReporter {
  onGroupFinish(group) {
    if (group.name) {
      if (group.pass) process.stdout.write("Group     : " + group.name + " -> ✔ PASS");
      else            process.stdout.write("Group     : " + group.name + " -> ❌ FAIL");
      process.stdout.write("\n");
    }
  }

  onTestFinish(group, test) {
    if (test.pass) process.stdout.write("Test      : " + group.name + " -> " + test.name + " ✔ PASS\n");
    else           process.stdout.write("Test      : " + group.name + " -> " + test.name + " ❌ FAIL\n");

    if (!test.pass) {
      process.stdout.write("Actual    : " + test.actual.message + "\n");
      process.stdout.write("Expected  : " + test.expected.message + "\n");
    }

    if (test.logs.length > 0) {
      test.logs.forEach((e, i) => {
        if (i > 0) process.stdout.write("\n");
        process.stdout.write("Log       : " + e.value);
      });
      process.stdout.write("\n");
    }
  }
  onFinish(context) {
    const passed = context.testGroups.filter(e => !e.pass).length === 0;
    if (passed) process.stdout.write("Suite     : ✔ PASS");
    else           process.stdout.write("Suite     : ❌ FAIL");
    process.stdout.write("\n");
  }
}

const reporter = new Reporter();

function relativeFromCwd(location) {
  return path.relative(process.cwd(), location);
}

const ascOptions = [
  relativeFromCwd(require.resolve("@as-pect/assembly/assembly/index.ts")),
  "--use", "ASC_RTRACE=1",
  "--explicitStart",
  "--validate",
  "--debug",
  "--measure",
  "--lib", "assembly",
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
  const cliOptions = ascOptions.concat([file, "--binaryFile", wasmFileName, "--textFile", watFileName]);

  process.stdout.write("Test File : " + file + " (untouched)\n");
  main(cliOptions, untouchedAscOptions, (err) => {
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

function runTest(file, type, binary, wat) {
  const watPath = path.join(path.dirname(file), path.basename(file, ".ts"))
    + "." + type +  ".wat";

  // should not block testing
  fs.writeFile(watPath, wat, (err) => {
    if (err) console.warn(err);
  });

  const context = new TestContext({
    fileName: file,
    reporter,
    stderr: process.stderr,
    stdout: process.stdout,
  });
  const imports = context.createImports({
    wasi_unstable: wasi.exports,
  });
  const wasm = instantiateBuffer(binary, imports);
  wasi.setMemory(wasm.memory);
  wasi.view = new DataView(wasm.memory.buffer);
  context.run(wasm);
  // TODO: when @as-pect/cli 2.2.1 is approved, just check context.pass
  for (const group of context.testGroups) {
    if (!pass) break;
    if (!group.pass) {
      pass = false;
      break;
    }
    for (const test of group.tests) {
      if (!test.pass) {
        pass = false;
        break;
      }
    }
  }
}

process.exit(pass ? 0 : 1);
