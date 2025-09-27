#!/bin/bash

# Start the agent server
echo "Starting the agent server..."
cd agent
uv run uvicorn agent.server:app --host 0.0.0.0 --port 9000 --reload &
AGENT_PID=$!

echo "Agent server started with PID: $AGENT_PID"
echo "Agent server running on http://127.0.0.1:9000"

# Wait a moment for the agent to start
sleep 3

# Start the Next.js frontend
echo "Starting the Next.js frontend..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo "Frontend started with PID: $FRONTEND_PID"
echo "Frontend running on http://localhost:3000"

echo ""
echo "Both servers are now running!"
echo "Agent: http://127.0.0.1:9000"
echo "Frontend: http://localhost:3000"
echo ""
echo "To stop both servers, press Ctrl+C"

# Wait for user to stop
wait
