import { parse } from "yaml";
import { readdirSync, readFileSync } from "fs";
// eslint-disable-next-line unicorn/import-style
import { join } from "path";

export function readYamlFolder<T>(
  type: "projects" | "members",
  folder: string
): T[] {
  const files: T[] = [];

  switch (type) {
    case "projects": {
      const directories: string[] = readdirSync(folder);

      for (const directory of directories) {
        const file = readFileSync(join(folder, directory, "project.yaml"));

        files.push(parse(file.toString()));
      }

      break;
    }

    case "members": {
      const members: string[] = readdirSync(folder);

      for (const member of members) {
        const file = readFileSync(join(folder, member));

        files.push(parse(file.toString()));
      }

      break;
    }
  }

  return files;
}
