import React from "preact/compat";
import { useEffect, useState } from "preact/hooks";
import { useLocation, useRoute } from "preact-iso"

export function Get() {
  const router = useLocation();
  const route = useRoute();
  const [password, setPassword] = useState<string>("");
  const [secret, setSecret] = useState<string>("");

  const fetchSecret = async () => {
    const id = route.params.id
    const url = import.meta.env.VITE_API_URL + `/secrets/${id}`;
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ password }),
    })
      .then(res => res.text())
      .then(data => {
        return data;
      }).catch(err => {
        alert("Invalid password");
        console.error(err);
      });

    if (!res)
      return
    setSecret(res);
  }

  return (
    <div class="flex flex-col items-center justify-center min-h-screen">
      <p class="text-5xl text-blue-700 font-semibold">
        Get secret
      </p>

      <div class="flex mt-8 items-center">
        <div class="flex flex-col">
          <label class="text-gray-500 text-lg">Secret's password</label>
          <input type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => (
            setPassword((e.target as HTMLInputElement).value)
          )} class="px-4 py-2 border-2 rounded-l-xl border-gray-300" />
        </div>
        <button onClick={fetchSecret} class="rounded-r-lg border-2 border-transparent py-2 px-4 bg-blue-600 text-white self-end">
          Get
        </button>
      </div>
      {secret && <div class="mt-6 w-full max-w-md flex items-center justify-center">
        <textarea class="mt-4 p-4 border-2 border-gray-300 rounded-xl resize-none" value={secret} readonly></textarea>
      </div>}

      <button onClick={() => router.route('/')} class="mt-4 rounded-lg border-2 border-transparent py-2 px-4 bg-gray-300 text-gray-700">
        Go back
      </button>
    </div>
  );
}