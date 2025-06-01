import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import express, { Request, Response } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";

// Parse command line arguments
const args = process.argv.slice(2);
const transportType = args.find(arg => arg === '--stdio' || arg === '--http') || '--stdio'; // Default to stdio

// Create server instance
const server = new McpServer({
  name: "mcp-current-datetime",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {
      "get-current-datetime": {
        description: "Get current datetime in ISO format",
        parameters: {},
      },
    },
  },
});

// Register tools
server.tool(
  "get-current-datetime",
  "Get current datetime in ISO format",
  {},
  async () => {
    return {
      content: [
        {
          type: "text",
          text: (new Date()).toISOString(),
        },
      ],
    };
  },
);

// HTTP Transport Handler
const setupHTTPServer = async () => {
  const app = express();
  app.use(cors()); // Enable CORS for all origins
  app.use(express.json());

  // Accept POST requests to both / and /mcp for MCP compatibility
  const mcpHandler = async (req: Request, res: Response) => {
    try {
      const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });
      res.on('close', () => {
        console.log('Request closed');
        transport.close();
        server.close();
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error('Error handling MCP request:', error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: 'Internal server error',
          },
          id: null,
        });
      }
    }
  };

  app.post('/mcp', mcpHandler);
  app.post('/', mcpHandler);

  app.get('/mcp', async (req: Request, res: Response) => {
    console.log('Received GET MCP request');
    res.writeHead(405).end(JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed."
      },
      id: null
    }));
  });

  app.delete('/mcp', async (req: Request, res: Response) => {
    console.log('Received DELETE MCP request');
    res.writeHead(405).end(JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed."
      },
      id: null
    }));
  });

  // Start the server
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`MCP Stateless Streamable HTTP Server listening on port ${PORT}`);
  });
};

// Stdio Transport Handler
const setupStdioServer = async () => {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Current Datetime MCP Server running on stdio");
  } catch (error) {
    console.error("Fatal error in stdio setup:", error);
    process.exit(1);
  }
};

// Main function to determine transport type
async function main() {
  if (transportType === '--stdio') {
    await setupStdioServer();
  } else {
    await setupHTTPServer();
  }
}

// Start the server
main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});