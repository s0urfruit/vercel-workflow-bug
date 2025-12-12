import { resumeWebhook } from "workflow/api"

async function call_webhook(request, params) {
	const token = params?.token
	if (!token) {
		return new Response("Missing token", { status: 400 })
	}
	try {
		return await resumeWebhook(token, request)
	} catch (error) {
		console.error("Error during resumeWebhook", error)
		return new Response(null, { status: 404 })
	}
}

export async function loader({ request, params }) {
	return call_webhook(request, params)
}

export async function action({ request, params }) {
	return call_webhook(request, params)
}
