import path from "path"
import { createRequire } from "module"

const require_cjs = createRequire(import.meta.url)
const flow = require_cjs(path.join(process.cwd(), ".well-known/workflow/v1/flow.js"))

function call_flow(request) {
	const method = request.method?.toUpperCase()
	const handler = flow[method] || flow.POST
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