import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig({
	plugins: lazyPlugins(() => [
		cloudflareTest({ wrangler: { configPath: "./wrangler.toml" } }),
	]),
	fmt: {
		useTabs: true,
		printWidth: 80,
		ignorePatterns: [
			"dist/**",
			".wrangler/**",
			"worker-configuration.d.ts",
			"skills-lock.json",
			".agents/**",
			".claude/**",
			"src/lib/api/**",
			"pnpm-lock.yaml",
		],
	},
	lint: {
		ignorePatterns: [
			"dist/**",
			".wrangler/**",
			"worker-configuration.d.ts",
			"skills-lock.json",
			".agents/**",
			".claude/**",
			"src/lib/api/**",
		],
		jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
		rules: { "vite-plus/prefer-vite-plus-imports": "error" },
		options: { typeAware: true, typeCheck: true },
	},
});
