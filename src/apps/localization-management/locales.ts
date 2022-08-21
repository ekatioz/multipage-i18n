type AbortableFetchResult<T> = {
  data?: T;
  canceled: boolean;
};

function abortableFetch<T>(
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1]
) {
  const controller = new AbortController();
  const signal = controller.signal;
  const cancel = () => controller.abort();

  const promise: Promise<AbortableFetchResult<T>> = fetch(input, {
    ...init,
    signal,
  })
    .then((r) => {
      if (r.ok) return r;
      throw new Error(r.statusText);
    })
    .then(async (r) => ({ data: (await r.json()) as T, canceled: false }))
    .catch((error) => {
      if (error.name !== "AbortError") throw error;
      return { canceled: true };
    });

  return {
    promise,
    cancel,
  };
}

export function getNamespaces() {
  return abortableFetch<string[]>("http://localhost:3000/namespaces/");
}

export function getTranslations(namespace: string) {
  return abortableFetch<Record<string, string>>(
    `http://localhost:3000/locales/de/${namespace}.json`
  );
}

export function saveTranslations(
  namespace: string,
  translations: Record<string, string>
) {
  return fetch(`http://localhost:3000/namespace/${namespace}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(translations),
  }).then((r) => {
    if (r.ok) return;
    throw new Error(r.statusText);
  });
}
