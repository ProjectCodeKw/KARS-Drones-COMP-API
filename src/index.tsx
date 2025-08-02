import { serve } from "bun";
import { readFileSync, writeFileSync } from "fs";
import index from "./index.html";

let CURRENT_ROUND = "round1";

const loadData = () => JSON.parse(readFileSync("./src/data.json", "utf-8"));
const saveData = (data: object) => writeFileSync("./src/data.json", JSON.stringify(data, null, 2));

function renderTable(data: any): string {
    let html = `<div class="overflow-auto"><table class="table-auto w-full border mt-4">
  <thead><tr class="bg-gray-200"><th class="px-4 py-2">Round</th><th class="px-4 py-2">Key</th><th class="px-4 py-2">Value</th></tr></thead><tbody>`;
    for (const round in data) {
        for (const key in data[round]) {
            html += `<tr class="border-t"><td class="px-4 py-2">${round}</td><td class="px-4 py-2">${key}</td><td class="px-4 py-2">${data[round][key]}</td></tr>`;
        }
    }
    html += "</tbody></table></div>";
    return html;
}

const server = serve({
  port: 3002,
  routes: {
    // Serve index.html for root route
    "/": async (req) => {
      const url = new URL(req.url);
      const auth = url.searchParams.get("auth");
      const showTable = auth === process.env.ADMIN_PASS;
      const tableHTML = showTable ? renderTable(loadData()) : "";
      const html = await Bun.file("./src/AdminPanel.html").text();
      return new Response(
        html
          .replace("<!--TABLE-->", tableHTML)
          .replace("<!--CURRENT_ROUND-->", CURRENT_ROUND),
        {
          headers: { "Content-Type": "text/html" },
        }
      );
    },

    // API routes for keys
    "/key1": {
      GET: () => {
        const data = loadData();
        const value = data[CURRENT_ROUND]?.["key1"];
        return new Response(value ?? "Not found", { status: value ? 200 : 404 });
      },
    },

    "/key2": {
      GET: () => {
        const data = loadData();
        const value = data[CURRENT_ROUND]?.["key2"];
        return new Response(value ?? "Not found", { status: value ? 200 : 404 });
      },
    },

    "/key3": {
      GET: () => {
        const data = loadData();
        const value = data[CURRENT_ROUND]?.["key3"];
        return new Response(value ?? "Not found", { status: value ? 200 : 404 });
      },
    },

    // Get current round
    "/current-round": {
      GET: () => {
        return Response.json({ 
          currentRound: CURRENT_ROUND,
          timestamp: new Date().toISOString()
        });
      },
    },

    // Static files
    "/AdminPanel.css": {
      GET: () => {
        const file = Bun.file("./src/AdminPanel.css");
        return new Response(file, {
          headers: { "Content-Type": "text/css" },
        });
      },
    },

    "/AdminPanel.js": {
      GET: () => {
        const file = Bun.file("./src/AdminPanel.tsx");
        return new Response(file, {
          headers: { "Content-Type": "application/javascript" },
        });
      },
    },

    // Admin panel routes
    "/admin": {
      GET: async (req) => {
        const url = new URL(req.url);
        const auth = url.searchParams.get("auth");
        const showTable = auth === process.env.ADMIN_PASS;
        const tableHTML = showTable ? renderTable(loadData()) : "";
        const html = await Bun.file("./src/AdminPanel.html").text();
        return new Response(
          html
            .replace("<!--TABLE-->", tableHTML)
            .replace("<!--CURRENT_ROUND-->", CURRENT_ROUND),
          {
            headers: { "Content-Type": "text/html" },
          }
        );
      },

      POST: async (req) => {
        const formData = await req.formData();
        const pass = formData.get("pass");
        const round = formData.get("round")?.toString();
        const key = formData.get("key")?.toString();
        const value = formData.get("value")?.toString();

        if (pass !== process.env.ADMIN_PASS) {
          return new Response("Wrong password", { status: 403 });
        }

        const data = loadData();
        if (round && key && value) {
          if (!data[round]) data[round] = {};
          data[round][key] = value;
          saveData(data);
        } else if (key && value) {
          // If no round specified, use current round
          if (!data[CURRENT_ROUND]) data[CURRENT_ROUND] = {};
          data[CURRENT_ROUND][key] = value;
          saveData(data);
        }

        return Response.redirect(`/admin?auth=${pass}`);
      },
    },

    // Change current round route
    "/change-round": {
      POST: async (req) => {
        const formData = await req.formData();
        const pass = formData.get("pass");
        const newRound = formData.get("round")?.toString();

        if (pass !== process.env.ADMIN_PASS) {
          return new Response("Wrong password", { status: 403 });
        }

        if (newRound) {
          CURRENT_ROUND = newRound;
          console.log(`Current round changed to: ${CURRENT_ROUND}`);
        }

        return Response.redirect(`/admin?auth=${pass}`);
      },
    },

    // API test routes
    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
