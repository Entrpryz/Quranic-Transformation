import { getSession } from "@/lib/session";
import { cookies } from "next/headers";

export default async function DebugPage() {
  const session = await getSession();
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  return (
    <div className="p-8 font-mono text-sm max-w-4xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Session Debugger</h1>

      <div className="border p-4 rounded bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700">
        <h2 className="font-bold mb-2">Current Session State</h2>
        <pre className="whitespace-pre-wrap word-break-all">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      <div className="border p-4 rounded bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700">
        <h2 className="font-bold mb-2">Raw Cookie</h2>
        {sessionCookie ? (
          <div>
            <p>
              <strong>Name:</strong> {sessionCookie.name}
            </p>
            <p>
              <strong>Value (First 50 chars):</strong>{" "}
              {sessionCookie.value.substring(0, 50)}...
            </p>
            <p>
              <strong>Value Length:</strong> {sessionCookie.value.length}
            </p>
          </div>
        ) : (
          <p className="text-red-500">No 'session' cookie found.</p>
        )}
      </div>

      <div className="border p-4 rounded bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700">
        <h2 className="font-bold mb-2">Environment Check</h2>
        <p>
          <strong>NODE_ENV:</strong> {process.env.NODE_ENV}
        </p>
        <p>
          <strong>JWT_SECRET Configured:</strong>{" "}
          {process.env.JWT_SECRET ? "Yes" : "No (Using Fallback)"}
        </p>
      </div>
    </div>
  );
}
