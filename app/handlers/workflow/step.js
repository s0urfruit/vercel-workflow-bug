import path from "path"
import { createRequire } from "module"

const require_cjs = createRequire(import.meta.url)

const step = require_cjs(path.join(process.cwd(), ".well-known/workflow/v1/step.js"))

export async function action({ request }) {
	return step.POST(request)
}

export async function loader({ request }) {
	if (step.GET) {
		return step.GET(request)
	}
	return new Response("Method not allowed", { status: 405 })
}