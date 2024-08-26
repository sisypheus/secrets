import React from "preact/compat";
import { useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso"

export function Create() {
  const router = useLocation();
  const [secret, setSecret] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setSuccess(true);
    }).catch(err => {
      console.error(err);
    });
  }

  const handleCreate = async () => {
    if (!secret || password)
      return;

    const url = import.meta.env.VITE_API_URL + "/secrets";

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ secret, password }),
    })
      .then(res => res.json())
      .then(data => {
        return data;
      }).catch(err => {
        console.error(err);
      });

    if (!res)
      return

    copyToClipboard(res.id!);
    setSuccess(true);
  }

  useEffect(() => {
    if (success) {
      setSecret("");
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    }

  }, [success]);

  return (
    <div class="flex flex-col items-center justify-center min-h-screen">
      <p class="text-5xl text-blue-700 font-semibold">
        Create secret
      </p>

      <div class="flex flex-col mt-8 items-center">
        <div class="flex flex-col space-y-2">
          <label class="text-gray-300 text-lg">Create secret</label>
          <textarea value={secret} placeholder={"secret message"} onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => (
            setSecret((e.target as HTMLTextAreaElement).value)
          )} class="px-4 py-2 border-2 rounded-xl border-gray-300 w-full" rows={5} />
          <label class="text-gray-300 text-lg">Password</label>
          <input value={password} type={"password"} placeholder={"encrypted"} onChange={(e: React.ChangeEvent<HTMLInputElement>) => (
            setPassword((e.target as HTMLInputElement).value)
          )} class="px-4 py-2 border-2 rounded-xl border-gray-300 w-full" rows={5} />
        </div>
        <button onClick={handleCreate} class="rounded-lg border-2 w-full my-4 border-transparent py-2 px-4 bg-blue-600 text-white self-end">
          Create
        </button>
      </div>
      {success && <div class="mt-4 w-full max-w-md flex items-center justify-center">
        <p class="text-green-500">Secret created and copied to clipboard</p>
      </div>}
      <div class="mt-4">
        <button onClick={() => router.route('/secrets')} class="rounded-lg border-2 border-transparent py-2 px-4 bg-gray-300 text-gray-700">
          Go back
        </button>
      </div>
    </div>

  );
}