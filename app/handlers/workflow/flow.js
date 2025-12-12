import path from "path"

const flow_module = import(path.join(process.cwd(), ".well-known/workflow/v1/flow.js"))

async function call_flow(request) {
	const mod = await flow_module
	const method = request.method?.toUpperCase()
	const handler = mod[method] || mod.POST
	if (!handler) {
		return new Response("Method not allowed", { status: 405 })
	}
	return handler(request)
}

export async function loader({ request }) {
	return call_flow(request)
}

export async function action({ request }) {
	return call_flow(request)
}