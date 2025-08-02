/** @jsxImportSource react */
import React from "react";
import "./AdminPanel.css";

export default function AdminPanel() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-8">
      <form
        method="POST"
        action="/admin"
        className="bg-white p-6 rounded shadow-md space-y-4 w-full max-w-md"
      >
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <input
          type="password"
          name="pass"
          placeholder="Admin password"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="round"
          placeholder="Round (e.g. round1)"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="key"
          placeholder="Key (e.g. key1)"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="value"
          placeholder="Value"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Submit
        </button>
      </form>
      <div
        className="w-full max-w-4xl mt-8"
        dangerouslySetInnerHTML={{ __html: "<!--TABLE-->" }}
      />
    </div>
  );
}
