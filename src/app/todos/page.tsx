import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

async function TodosList() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase.from("todos").select();

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
          <b>Note:</b> {error.message} (Create the <code className="bg-amber-100 px-1 py-0.5 rounded">todos</code> table in your Supabase dashboard if you haven't yet).
        </div>
      )}

      <ul className="space-y-2">
        {todos && todos.length > 0 ? (
          todos.map((todo: any) => (
            <li
              key={todo.id}
              className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {todo.name || todo.title || JSON.stringify(todo)}
            </li>
          ))
        ) : (
          <li className="text-sm text-slate-400 py-4 text-center">
            No todos found in Supabase.
          </li>
        )}
      </ul>
    </>
  );
}

export default function TodosPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Supabase Todos Test</h1>
          <Link
            href="/"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
          >
            ← Back to Ritual.ai
          </Link>
        </div>

        <Suspense fallback={<div className="text-sm text-slate-500 py-4 text-center">Loading Supabase data…</div>}>
          <TodosList />
        </Suspense>
      </div>
    </div>
  );
}
