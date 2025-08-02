import { serve } from "bun";
import { config } from "dotenv";
import { readFileSync, writeFileSync } from "fs";
import AdminPanel from "AdminPanel.html"

config();
let CURRENT_ROUND = "round1";

const loadData = () => JSON.parse(readFileSync("./data.json", "utf-8"));
const saveData = (data: object) => writeFileSync("./data.json", JSON.stringify(data, null, 2));

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

Bun.serve({
    port: 3001,
    routes: {
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



        // Admin panel routes
        "/": {
            GET: async (req) => {
                const url = new URL(req.url);
                const auth = url.searchParams.get("auth");
                const showTable = auth === process.env.ADMIN_PASS;
                const tableHTML = showTable ? renderTable(loadData()) : "";
                const html = await Bun.file("AdminPanel.html").text();
                return new Response(html.replace("<!--TABLE-->", tableHTML), {
                    headers: { "Content-Type": "text/html" },
                });
            },
        },

        "/admin": AdminPanel
    },

    error(error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 });
    },
});
