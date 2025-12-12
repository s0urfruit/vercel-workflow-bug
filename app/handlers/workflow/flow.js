import path from "path"
import { createRequire } from "module"

const require_cjs = createRequire(import.meta.url)

// .well-known/workflow/v1/package.json sets "type": "commonjs"
// so Node loads .js files there as CommonJS without needing .cjs extension
const flow = require_cjs(path.join(process.cwd(), ".well-known/workflow/v1/flow.js"))

export async function action({ request }) {
	return flow.POST(request)
}

export async function loader({ request }) {
	if (flow.GET) {
		return flow.GET(request)
	}
	return new Response("Method not allowed", { status: 405 })
}