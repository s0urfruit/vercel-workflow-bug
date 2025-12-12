import path from "path"
import { createRequire } from "module"

const require_cjs = createRequire(import.meta.url)
const step = require_cjs(path.join(process.cwd(), ".well-known/workflow/v1/step.js"))

function call_step(request) {
	const method = request.method?.toUpperCase()
	const handler = step[method]
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