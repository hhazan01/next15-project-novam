export const fetcher = async <T>(
  url: string,
  params?: RequestInit
): Promise<T> => {
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    ...params,
  } as RequestInit & { next?: { revalidate?: number } });

  if (!res.ok) throw new Error("Error al obtener los datos.");

  return res.json();
};
