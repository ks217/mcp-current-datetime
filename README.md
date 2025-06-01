# MCP Current Datetime Server

This project implements a **Model Context Protocol (MCP)** server that provides the current datetime in ISO 8601 format. It supports communication over **standard input/output (stdio)** and **HTTP**.

## ✨ Features

- **Tool:** `get-current-datetime` — Returns the current datetime as a string in ISO format.
- **Transport Modes:** You can run the MCP server as stdio or http transport layer using arguments:
  - `--stdio`: Communicate over stdin/stdout (default).
  - `--http`: Start an HTTP server that listens for JSON-RPC 2.0 requests.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm (Node package manager)

### Installation

```sh
npm install
```

### Building the Project

```sh
npm run build
```

## 🏁 Running the Server

### STDIO Mode (default)

```sh
node build/index.js
```

### HTTP Mode

```sh
node build/index.js --http
```

The HTTP server will listen on **port 3000** by default and accept MCP requests via POST on `/` or `/mcp`.

## 🛠️ Tool: `get-current-datetime`

- **Description:** Returns the current datetime in ISO 8601 format.
- **Parameters:** None
- **Response Format:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "2025-06-01T12:34:56.789Z"
    }
  ]
}
```

## ⚙️ Integration Examples

### Claude Desktop App Config (STDIO)

```json
"currentDatetime": {
  "command": "node",
  "args": [
    "<FULL-PATH-TO-PROJECT>/build/index.js"
  ]
}
```

### VS Code Copilot Config (STDIO)

```json
{
  "mcp": {
    "servers": {
      "currentDatetime": {
        "type": "stdio",
        "command": "node",
        "args": [
          "<FULL-PATH-TO-PROJECT>/build/index.js"
        ]
      }
    }
  }
}
```

### HTTP Integration (for Web or Localhost Clients)

Send a `POST` request to `http://localhost:3000/` or `/mcp` with a valid MCP JSON-RPC request.

## 🔒 CORS

CORS is enabled for all origins in HTTP mode to simplify local testing and cross-origin integration.

## 📄 License

See [LICENSE](LICENSE) for details.