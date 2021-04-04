import { parse } from "yaml";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

export async function readYamlFolder <T> (folder: string): Promise<T[]> {
    return readdir(folder)
        .then((files) => Promise.all(files.map((path) => readFile(path)))
            .then((files) => files.map((file) => parse(join(folder, file.toString())) as T)));
}