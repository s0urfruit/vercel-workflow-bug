// webhook.js uses ESM, so we import from workflow/api directly
import { resumeWebhook } from "workflow/api"

async function handler(request, params) {
	const token = params?.token
	
	if (!token) {
		return new Response("Missing token", { status: 400 })
	}

	try {
		const response = await resumeWebhook(token, request)
		return response
	} catch (error) {
		console.error("Error during resumeWebhook", error)
		return new Response(null, { status: 404 })
	}
}

export async function action({ request, params }) {
	return handler(request, params)
}

export async function loader({ request, params }) {
	return handler(request, params)
}
