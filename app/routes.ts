import { type RouteConfig } from "@react-router/dev/routes";

import { nextRoutes, pageRouterStyle } from "rr-next-routes/react-router";
import { route } from "@react-router/dev/routes"

const routes = [
    // Workflow DevKit routes
    route(".well-known/workflow/v1/flow", "./handlers/workflow/flow.js"),
    route(".well-known/workflow/v1/step", "./handlers/workflow/step.js"),
    route(".well-known/workflow/v1/webhook/:token", "./handlers/workflow/webhook.js"),
    ...nextRoutes({ ...pageRouterStyle, print: "tree" }),
];

export default routes satisfies RouteConfig;
