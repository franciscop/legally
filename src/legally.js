const { join, list, read, stat, walk } = require("files");
const { relative, isAbsolute } = require("path");
const searchText = require("./search_text");
const searchJson = require("./search_json");

// Search for text in any of the matching regex files for the root
const search = (root, regex) =>
  list(root)
    .filter(file => regex.test(file))
    .filter(file => stat(file).isFile())
    .map(read)
    .map(searchText)
    .reduce((all, one) => [...all, ...one], []);

// Require an absolute package
const pack = async path => {
  try {
    return await read(await join(path, "package.json")).then(file =>
      JSON.parse(file)
    );
  } catch (error) {
    return;
  }
};

const isPackage = /(\/|\\)package\.json$/;
const isLicense = /(license|copying)(\.md|\.txt)?$/i;
const isReadme = /readme(\.md|\.txt)?$/i;
const isTestFile = /(\/test\/)|(\\test\\)/;

// Root project to analize
module.exports = async (root = "./node_modules") => {
  return walk(root)
    .map(file => {
      // If the root path is relative, then the file path being used should also be
      // relative to avoid accidentally excluding a path containing "test" further
      // up the file structure.
      if (!isAbsolute(root)) {
        file = relative(process.cwd(), file);
      }

      return file;
    })
    .filter(file => isPackage.test(file)) // Only find package.json parent folders
    .filter(file => !isTestFile.test(file)) // Avoid looking into some resolver tests
    .map(pkg => pkg.replace(isPackage, ""))
    .filter(file => pack(file))
    .map(async root => {
      const packageJson = await pack(root);
      return {
        name: packageJson.name + "@" + packageJson.version,
        homepage: packageJson.homepage,
        package: searchJson(packageJson),
        copying: await search(root, isLicense),
        readme: await search(root, isReadme)
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
    .reduce((obj, { name, ...one }) => ({ ...obj, [name]: one }), {});
};
