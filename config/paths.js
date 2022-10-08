const path = require("path");
const fs = require("fs");
const url = require("url");
const glob = require("glob");

const { basename } = path;

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith("/");
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  } else {
    return inputPath;
  }
}

const getPublicUrl = (appPackageJson, pathKey = "default") =>
  envPublicUrl || require(appPackageJson).paths[pathKey];

const getHomepage = (appPackageJson) => require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "paths" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedAppPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson, "default");
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : "/");
  return ensureSlash(servedUrl, true);
}

function getServedSeoPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson, "seo");
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : "/");
  return ensureSlash(servedUrl, true);
}

const moduleFileExtensions = [
  "web.mjs",
  "mjs",
  "web.js",
  "js",
  "web.ts",
  "ts",
  "web.tsx",
  "tsx",
  "json",
  "web.jsx",
  "jsx"
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

/**
 * searches the given `sourcePath` for an `index.tsx` for each
 * subfolder of the `sourcePath` and returns an object where
 * the the key is the name of the subfolder and the value
 * is the path to the `index.tsx`
 *
 * @param {(path:string) => string} resolveFn
 * @param {string} sourcePath
 * @param {function} filterPredicate
 *
 * @param fileName
 * @returns {{[entryName: string]: string}}
 */
const resolveEntries = (
  resolveFn,
  sourcePath,
  filterPredicate = () => true,
  fileName = "index.tsx"
) => {
  return Object.assign(
    {},
    // we manage all entry-files in their own folder
    // so first we need to resolve all folders
    ...glob
      .sync(`${sourcePath}/*`)
      .filter(filterPredicate)
      .map((path) => {
        // the last path segment will be the entry's name
        const page = basename(path);
        // now search for the `index.tsx` within the entry's folder
        const [indexFile] = glob
          .sync(`${path}/${fileName}`)
          .sort((filePath1, filePath2) => filePath1.length - filePath2.length);
        // there should always be one index-file per entry
        if (!!indexFile && fs.existsSync(resolveFn(indexFile))) {
          return { [page]: resolveFn(indexFile) };
        }
        // TODO: warn about missing index-file
        return {};
      })
  );
};

const servedAppPath = getServedAppPath(resolveApp("package.json"));
const servedSeoPath = getServedSeoPath(resolveApp("package.json"));

function isSeoEntry(path) {
  return basename(path) === "seo";
}

function isNoSeoEntry(path) {
  return !isSeoEntry(path);
}

// we're in ./config/
module.exports = {
  dotenv: resolveApp(".env"),
  appPath: resolveApp("."),
  app: {
    build: resolveApp(`../../${servedAppPath}`),
    servedPath: servedAppPath,
    entries: resolveEntries(resolveApp, "src/pages", isNoSeoEntry, "index.tsx")
  },
  seo: {
    build: resolveApp(`../../${servedSeoPath}`),
    servedPath: servedSeoPath,
    entries: resolveEntries(resolveApp, "src/pages", isSeoEntry, "index.tsx")
  },
  appPackageJson: resolveApp("package.json"),
  appSrc: resolveApp("src"),
  appTsConfig: resolveApp("tsconfig.json"),
  appJsConfig: resolveApp("jsconfig.json"),
  yarnLockFile: resolveApp("yarn.lock"),
  testsSetup: resolveModule(resolveApp, "src/setupTests"),
  proxySetup: resolveApp("src/setupProxy.js"),
  appNodeModules: resolveApp("node_modules"),
  publicUrlApp: getPublicUrl(resolveApp("package.json"), "default"),
  publicUrlSeo: getPublicUrl(resolveApp("package.json"), "seo"),
  homepage: getHomepage(resolveApp("package.json"))
};

module.exports.moduleFileExtensions = moduleFileExtensions;
