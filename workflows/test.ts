import { sleep } from "workflow"

export async function testWorkflow(payload: { random_email: string }) {
    "use workflow"

    const { random_email } = payload

    console.log("Starting test workflow")
    const step_1 = await randomStep(random_email)

    await sleep(1000)

    const step_2 = await randomStep2(step_1.address, step_1.domain)

    console.log(`Step 1: ${step_1.address}@${step_1.domain}; Step 2: ${step_2.a_len} ${step_2.d_len}`)
    return { step_1, step_2 }
}

export async function randomStep(email: string) {
    "use step"

    console.log("Random Step 1")
    const [address, domain] = email.split("@")
    return { address, domain }
}

export async function randomStep2(address: string, domain: string) {
    "use step"
    console.log("Random Step 2")
    return { a_len: address.length, d_len: domain.length }
}