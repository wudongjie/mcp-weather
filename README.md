# Weather MCP Server

A Model Context Protocol server that provides real-time weather information and forecasts.

This MCP server connects AI assistants with live weather data, enabling them to provide current weather conditions and multi-day forecasts for any location worldwide.

## Features

### Tools
- `fetch-weather` - Get current weather conditions for any city
  - Real-time temperature, humidity, wind, and atmospheric data
  - Air quality information included
  - Detailed weather descriptions

- `fetch-weather-forecast` - Get weather forecasts up to 10 days ahead
  - Daily high/low temperatures
  - Precipitation chances and weather conditions
  - Wind speeds and humidity levels
  - Weather alerts and warnings when available

## Development

Install dependencies:
```bash
npm install
```

Build the server:
```bash
npm run build
```

For development with auto-rebuild:
```bash
npm run watch
```

## Installation

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "Weather-mcp": {
      "env": {
        "WEATHER_API_KEY": "xxx"
      },
      "command": "node",
      "args": ["/Users/dongjiewu/project/allmcpserver/mcp-weather/build/index.js"]
    }
  }
}
```

You'll need to obtain a free API key from [WeatherAPI.com](https://www.weatherapi.com/) and set it in your environment configuration.

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.
