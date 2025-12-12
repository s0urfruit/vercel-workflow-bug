# Vercel Workflow Bug

## Issue
Locally, Workflows run perfectly! I can start, monitor, and cancel them with ease. However, in production, despite building, deploying, and even queueing the workflow run, the run forever stays in `pending`. 

Furthermore, the Observability dashboard claims upwards of 200 of these 'runs' were completed... yet only ~4 ran and all 4 were cancelled by me; sample run IDs: `wrun_01KC8624HSAREY1XYRTCC662C0`, `wrun_01KC850FCA27HC54FA6MJXVN2K`, `wrun_01KC85KKRR93AV2Q91AFNCZTSS`, `wrun_01KC850FBYTPXNRM4V96F0S2XH`

In Runtime Logs, Vercel shows outgoing requests when I trigger the workflow, and they succeed:
```
POST
vercel-workflow.com/api/v1/runs/create
200

POST
vercel-queue.com/api/v2/messages
201

POST
vercel-workflow.com/api/v1/runs/create
200

POST
vercel-queue.com/api/v2/messages
201
```

## Stack
- Latest React Router
- "rr-next-routes" (just fills out routes.ts for me)
- Latest Workflow SDK

## Deployment
Check out the deployment at https://vercel-workflow-bug.vercel.app. Trigger as many workflows as you'd like via:
```
curl -X POST https://vercel-workflow-bug.vercel.app/api/start
```

Here's a production run ID: `wrun_01KC9X1RQHC024Q8B8Y3VZ6NYT`

## Attempted Fixes

### Attempt 1 (current impl. here)
Originally only debugging locally, my main goal was to ensure Workflow had access to the generated files (flow, step, and webhook.js). My stack is a bit different from a normal React Router 7 application, as I use a library that makes file-based routing feel more like Next.js. 

Eventually, I added the routes to `routes.ts`:
```typescript
const routes = [
    // Workflow DevKit routes
    route(".well-known/workflow/v1/flow", "./handlers/workflow/flow.js"),
    route(".well-known/workflow/v1/step", "./handlers/workflow/step.js"),
    route(".well-known/workflow/v1/webhook/:token", "./handlers/workflow/webhook.js"),
    ...nextRoutes({ ...pageRouterStyle, print: "tree" }),
];
```

and wrote 3 handler files:
```typescript
// /app/handlers/workflow/flow.js (step is identical, just a different path)
import path from "path"
import { createRequire } from "module"

const require_cjs = createRequire(import.meta.url)
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
```

```typescript
// /app/handlers/workflow/webhook.js
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
```

With this, all of my workflows began to work! 
(e.g.)

```
curl -X POST http://localhost:5173/api/start
> {"data":{"runId":"wrun_01KC9W9CMW84KCYHYNWMZD2ZJB","world":{"runs":{},"steps":{},"events":{},"hooks":{}}}}
```

```
// Workflow Logs
Starting test workflow
Random Step 1
Random Step 2
Step 1: test-0.9702199053237919@example.com; Step 2: 23 11
```

The test in the docs also passes:
```
"Start your server and verify routes respond:"
curl -X POST http://localhost:3000/.well-known/workflow/v1/flow
curl -X POST http://localhost:3000/.well-known/workflow/v1/step
curl -X POST http://localhost:3000/.well-known/workflow/v1/webhook/test
```

### Other Attempts

I've read these docs extensively (https://useworkflow.dev/docs/how-it-works/framework-integrations#adapting-to-other-frameworks), and have tried:

- a Vite plugin that uses `@swc/transform`
- Using `@swc/transform` in the Workflow handlers
- Copying the Bun integration word for word
- Adding Nitro
- Copying "Adapting to Other Frameworks" line-for-line 
- Copying the "Bun Example" nearly line-for-line

**Note: In most, if not all, of these attempts, Workflow worked locally, but remained queued indefinitely in Vercel World.**