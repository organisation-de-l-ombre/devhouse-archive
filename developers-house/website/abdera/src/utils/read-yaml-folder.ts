import { parse } from "yaml";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

export function readYamlFolder <T> (folder: string): Promise<T[]> {
    const files = readdirSync(folder)
    return Promise.all(files.map((path) => readFileSync(join(folder, path))))
            .then((files) => files.map((file) => parse(file.toString()) as T));
}