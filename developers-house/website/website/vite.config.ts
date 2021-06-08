import { defineConfig, Plugin } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { getAliases } from 'vite-aliases';
import { transformAsync } from "@babel/core";
import { generateSW } from "rollup-plugin-workbox";

const alias = getAliases();

export const emotionBabel: Plugin = {
    name: "emotion-babel",
    transform: async (code, id) => {
        if (id.endsWith(".tsx") || id.endsWith(".ts")) {
            const result = await transformAsync(code, {
                filename: id,
                presets: [["@emotion/babel-preset-css-prop", { autoLabel: "always" }]],
                plugins: [["@emotion/babel-plugin", { autoLabel: "always" }]],
            });

            return result.code;
        }
        return code;
    }
}


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        reactRefresh(),
        emotionBabel,

        generateSW({
            swDest: 'dist/service-worker.js',
            globDirectory: 'dist',
        }) as unknown as Plugin
    ],
    resolve: {
        alias,
    },
    esbuild: {
        jsxFactory: "jsx",
        "jsxInject": "import {jsx} from '@emotion/react';",
    },
    publicDir: "public",
    define: {
        global: 'globalThis'
    }
});