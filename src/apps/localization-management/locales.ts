async function handleFetch<T>(fetchPromise: Promise<Response>) {
  const result = await fetchPromise;
  if (!result.ok) throw new Error(result.statusText);
  return result.json() as Promise<T>;
}

export async function getNamespaces(signal: AbortSignal) {
  return handleFetch<string[]>(
    fetch("http://localhost:3000/namespaces/", { signal })
  );
}

export function getTranslations(signal: AbortSignal, namespace: string) {
  return handleFetch<Record<string, string>>(
    fetch(`http://localhost:3000/locales/de/${namespace}.json`, { signal })
  );
}

export function saveTranslations(
  namespace: string,
  translations: Record<string, string>
) {
  return handleFetch<void>(
    fetch(`http://localhost:3000/namespace/${namespace}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(translations),
    })
  );
}
