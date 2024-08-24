import React from "preact/compat";
import { useState } from "preact/hooks";
import { useLocation } from "preact-iso"

export function Create() {
  const router = useLocation();
  const [id, setId] = useState<string>("");

  const onClick = () => {
    useLocation().route('/secrets' + (id ? `/${id}` : ''));
  }

  return (
    <div class="flex flex-col items-center justify-center min-h-screen">
      <p class="text-5xl text-blue-700 font-semibold">
        Secrets vault
      </p>

      <div class="flex mt-8 items-center">
        <div class="flex flex-col">
          <label class="text-gray-500 text-lg">Find secret</label>
          <input value={id} onChange={(e: React.ChangeEvent<HTMLInputElement>) => (
            setId((e.target as HTMLInputElement).value)
          )} class="px-4 py-2 border-2 rounded-l-xl border-gray-300" />
        </div>
        <button onClick={onClick} class="rounded-r-lg border-2 border-transparent py-2 px-4 bg-blue-600 text-white self-end">
          Search
        </button>
      </div>
      <div class="mt-4">
        <button onClick={() => router.route('/secrets')} class="rounded-lg border-2 border-transparent py-2 px-4 bg-gray-300 text-gray-700">
          Create secret
        </button>
      </div>
    </div>

  );
}