import { exports } from "cloudflare:workers";
import { describe, expect, it } from "vite-plus/test";

describe("Notion to Stripe webhook worker", () => {
	it("serves the existing root response", async () => {
		const response = await exports.default.fetch("https://example.com/");
		expect(response.status).toBe(200);
		expect(await response.text()).toBe("Hello World");
	});

	it("rejects an invalid Notion payload before creating an invoice", async () => {
		const response = await exports.default.fetch(
			"https://example.com/webhook",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ data: {} }),
			},
		);
		expect(response.status).toBe(400);
	});
});
