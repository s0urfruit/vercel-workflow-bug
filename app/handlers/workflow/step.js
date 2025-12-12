import path from "path"

const step_module = import(path.join(process.cwd(), ".well-known/workflow/v1/step.js"))

async function call_step(request) {
	const mod = await step_module
	const method = request.method?.toUpperCase()
	const handler = mod[method] || mod.POST
	if (!handler) {
		return new Response("Method not allowed", { status: 405 })
	}
	return handler(request)
}

export async function loader({ request }) {
	return call_step(request)
}

export async function action({ request }) {
	return call_step(request)
}