import path from "path"

const webhook_module = import(path.join(process.cwd(), ".well-known/workflow/v1/webhook.js"))

async function call_webhook(request) {
	const mod = await webhook_module
	const method = request.method?.toUpperCase()
	const handler = mod[method]
	if (!handler) {
		return new Response("Method not allowed", { status: 405 })
	}
	return handler(request)
}

export async function loader({ request }) {
	return call_webhook(request)
}

export async function action({ request }) {
	return call_webhook(request)
}
