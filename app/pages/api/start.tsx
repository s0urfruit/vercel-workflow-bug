import { start } from "workflow/api"
import { testWorkflow } from "~/workflows/test"

export async function action({ request }: { request: Request }) {
    const random_email = `test-${Math.random()}@example.com`
    const workflow = await start(testWorkflow, [{random_email}])
    return new Response(JSON.stringify({ data: workflow }), { status: 200 })
}