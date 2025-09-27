import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { LlamaIndexAgent } from "@ag-ui/llamaindex";

import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
 
  const runtime = new CopilotRuntime({
    agents: {
      sample_agent: new LlamaIndexAgent({ // TODO: Change agent name to match layout.tsx
        url: "http://127.0.0.1:9000/run", // TODO: Update URL to point to new photo analysis agent
      })
    }
  })

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new ExperimentalEmptyAdapter(),
    endpoint: `/api/copilotkit`,
  });

  return handleRequest(request);
}
