import { Hono } from "hono";
import Stripe from "stripe";
import { vValidator } from "@hono/valibot-validator";
import * as v from "valibot";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Client as NotionClient } from "@notionhq/client";

async function createAndSendInvoice(
	stripe: Stripe,
	pageId: string,
	customerId: string,
): Promise<Stripe.Invoice> {
	try {
		// 請求書の作成
		const invoice = await stripe.invoices.create({
			customer: customerId,
			collection_method: "send_invoice",
			days_until_due: 30,
			metadata: {
				pageId: pageId,
			},
		});

		// 請求アイテムの作成
		const invoiceItem = await stripe.invoiceItems.create({
			customer: customerId,
			price: "price_1QWpYBD37ZFLFPSrxmlhTHZT",
			invoice: invoice.id,
		});

		// 請求書の送信
		const sentInvoice = await stripe.invoices.sendInvoice(invoice.id);

		return sentInvoice;
	} catch (error) {
		console.error("請求書の作成・送信に失敗しました:", error);
		throw error;
	}
}

interface Env {
	STRIPE_SECRET_KEY: string;
	NOTION_API_KEY: string;
}

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
	return c.text("Hello World");
});

type RemoveId<T> = T extends unknown ? Omit<T, "id"> : never;
type Property = PageObjectResponse["properties"][number];

interface NotionWebhookBody {
	data: {
		id: string;
		properties: Record<string, RemoveId<Property>>;
	};
}

const RichTextSchema = v.object({
	type: v.literal("rich_text"),
	rich_text: v.array(
		v.object({
			plain_text: v.string(),
			type: v.any(),
			equation: v.any(),
			annotations: v.any(),
			href: v.any(),
		}),
	),
});

const ReqBodySchema = v.object({
	data: v.object({
		id: v.string(),
		properties: v.object({
			顧客ID: RichTextSchema,
		}),
	}),
});

// NotionからのWebhookを受け取り、Stripeに請求書を作成する
app.post("/webhook", vValidator("json", ReqBodySchema), async (c) => {
	const stripe = new Stripe(c.env.STRIPE_SECRET_KEY, {
		apiVersion: "2024-11-20.acacia",
	});

	const body = c.req.valid("json") satisfies NotionWebhookBody;

	const customerId = body.data.properties.顧客ID.rich_text
		.map((text) => text.plain_text)
		.join("");

	const result = await createAndSendInvoice(stripe, body.data.id, customerId);

	console.log(result);

	return c.body(null, 204);
});

// StripeからのWebhookを受け取り、Notionのステータスを更新する
app.post("/stripe/webhook", async (c) => {
	const body = await c.req.json<
		Stripe.InvoicePaymentSucceededEvent | Stripe.InvoicePaymentFailedEvent
	>();

	console.log(JSON.stringify(body, null, 2));

	const pageId = body.data.object.metadata?.pageId;
	if (!pageId) {
		console.error("ページIDが存在しません");
		return c.body(null, 204);
	}

	// Notion Clientを初期化
	const notion = new NotionClient({
		auth: c.env.NOTION_API_KEY,
	});

	// notionページのステータスを更新
	await notion.pages.update({
		page_id: pageId,
		properties: {
			ステータス: {
				status: {
					name: "完了",
				},
			},
		},
	});

	return c.body(null, 204);
});

export default app;
