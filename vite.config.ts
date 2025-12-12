import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { workflow } from "workflow/vite";
import { transform } from "@swc/core";
import path from "path";

function workflow_swc_plugin() {
	return {
		name: "workflow-swc-client-transform",
		async transform(code: string, id: string) {
			if (!id.match(/\.(ts|tsx|js|jsx)$/)) {
				return null;
			}
			if (!code.match(/(use step|use workflow)/)) {
				return null;
			}
			const result = await transform(code, {
				filename: id,
				jsc: {
					experimental: {
						plugins: [[require.resolve("@workflow/swc-plugin"), { mode: "client" }]],
					},
				},
			});
			return { code: result.code, map: result.map };
		},
	};
}

export default defineConfig({
	plugins: [
		tailwindcss(),
		workflow_swc_plugin(),
		reactRouter(),
		tsconfigPaths(),
		workflow(),
	],
	resolve: {
		alias: {
			"~": path.resolve(__dirname),
			"@": path.resolve(__dirname, "app"),
		},
	},
});
