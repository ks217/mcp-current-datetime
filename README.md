# MCP Current Datetime Server

This project implements a Model Context Protocol (MCP) server that provides the current datetime in ISO 8601 format. The server is built using the `@modelcontextprotocol/sdk` and communicates over standard input/output (stdio).

## Features
- **Tool:** `get-current-datetime` — Returns the current datetime as a string in ISO format.

## Usage

### Prerequisites
- Node.js (v16 or higher recommended)
- npm (Node package manager)

### Installation
1. Clone this repository or copy the project files.
2. Install dependencies:
   ```sh
   npm install
   ```

### Running the Server
To start the MCP server:
```sh
npm run build   # If using TypeScript, ensure the code is compiled
node build/index.js
```
The server will listen for MCP requests on stdio.

### Tool: get-current-datetime
- **Description:** Returns the current datetime in ISO 8601 format.
- **Usage:**
    - Call the `get-current-datetime` tool via an MCP client.
    - The response will contain a `text` field with the current datetime string.

#### Example Response
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

## Integration Examples

### Claude Desktop App Sample Config
Add the following to your Claude Desktop App configuration to use this MCP server:

```json
"currentDatetime": {
  "command": "node",
  "args": [
    "<FULL-PATH-TO-PROJECT-ROOT-FOLDER>/build/index.js"
  ]
}
```

### VS Code Copilot Sample Config
To integrate with VS Code Copilot (or similar MCP-compatible tools), use a configuration like:

```json
{
    "mcp":{
        "servers": {
            "currentDatetime": {
                "type": "stdio",
                "command": "node",
                "args": [
                    "<FULL-PATH-TO-PROJECT-ROOT-FOLDER>/build/index.js"
                ]
            }
        }
    }
}
```

## License
See [LICENSE](LICENSE) for details.
