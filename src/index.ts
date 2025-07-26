import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";


  const server = new McpServer({
    name: "example-server",
    version: "1.0.0"
  });

  // ... set up server resources, tools, and prompts ...
  server.tool(
      "fetch-weather",
      { city: z.string() },
      async ({ city }) => {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}&aqi=yes`);
        const data = await response.json();
        
        if (data.error) {
          return {
            content: [{ type: "text", text: `Error: ${data.error.message}` }]
          };
        }

        const location = data.location;
        const current = data.current;
        
        const weather = `Weather in ${location.name}, ${location.region}, ${location.country}:
Temperature: ${current.temp_c}°C (${current.temp_f}°F) - Feels like ${current.feelslike_c}°C (${current.feelslike_f}°F)
Condition: ${current.condition.text}
Humidity: ${current.humidity}%
Wind: ${current.wind_kph} km/h (${current.wind_mph} mph) ${current.wind_dir}
Pressure: ${current.pressure_mb} mb (${current.pressure_in} in)
Visibility: ${current.vis_km} km (${current.vis_miles} miles)
UV Index: ${current.uv}
Last updated: ${current.last_updated}`;

        return {
          content: [{ type: "text", text: weather }]
        };
      }
    );

  server.tool(
      "fetch-weather-forecast",
      { 
        city: z.string(),
        days: z.number().min(1).max(10).default(3)
      },
      async ({ city, days = 3 }) => {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${city}&days=${days}&aqi=yes`);
        const data = await response.json();
        
        if (data.error) {
          return {
            content: [{ type: "text", text: `Error: ${data.error.message}` }]
          };
        }

        const location = data.location;
        const current = data.current;
        const forecast = data.forecast.forecastday;
        
        let weatherInfo = `Weather forecast for ${location.name}, ${location.region}, ${location.country}:

CURRENT CONDITIONS:
Temperature: ${current.temp_c}°C (${current.temp_f}°F) - Feels like ${current.feelslike_c}°C (${current.feelslike_f}°F)
Condition: ${current.condition.text}
Humidity: ${current.humidity}%
Wind: ${current.wind_kph} km/h ${current.wind_dir}
Pressure: ${current.pressure_mb} mb
UV Index: ${current.uv}

FORECAST:`;

        forecast.forEach((day: any, index: number) => {
          const dayData = day.day;
          const date = new Date(day.date).toLocaleDateString();
          
          weatherInfo += `
${index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : date}:
  High: ${dayData.maxtemp_c}°C (${dayData.maxtemp_f}°F)
  Low: ${dayData.mintemp_c}°C (${dayData.mintemp_f}°F)
  Condition: ${dayData.condition.text}
  Chance of rain: ${dayData.daily_chance_of_rain}%
  Chance of snow: ${dayData.daily_chance_of_snow}%
  Max wind: ${dayData.maxwind_kph} km/h
  Avg humidity: ${dayData.avghumidity}%
  UV Index: ${dayData.uv}`;
        });

        if (data.alerts && data.alerts.alert && data.alerts.alert.length > 0) {
          weatherInfo += `\n\nWEATHER ALERTS:`;
          data.alerts.alert.forEach((alert: any) => {
            weatherInfo += `\n⚠️ ${alert.headline}: ${alert.desc}`;
          });
        }

        return {
          content: [{ type: "text", text: weatherInfo }]
        };
      }
    );
  

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);

