import { type Person, makeData } from './makeData';

// A stand-in for a backend that pages, sorts and filters on the "server".
const database = makeData(1_000);

export type Query = {
  filters: { id: string; value: unknown }[];
  globalFilter: string;
  pageIndex: number;
  pageSize: number;
  sorting: { desc: boolean; id: string }[];
};

export async function fetchPeople(query: Query) {
  await new Promise((resolve) => setTimeout(resolve, 400)); // network latency

  let rows = [...database];

  for (const { id, value } of query.filters) {
    rows = rows.filter((row) =>
      String(row[id as keyof Person]).toLowerCase().includes(String(value).toLowerCase()),
    );
  }

  if (query.globalFilter) {
    const search = query.globalFilter.toLowerCase();
    rows = rows.filter((row) =>
      [row.firstName, row.lastName, row.email, row.state].some((v) =>
        v.toLowerCase().includes(search),
      ),
    );
  }

  for (const { desc, id } of [...query.sorting].reverse()) {
    rows.sort((a, b) => {
      const x = a[id as keyof Person] as string | number;
      const y = b[id as keyof Person] as string | number;
      return (x < y ? -1 : x > y ? 1 : 0) * (desc ? -1 : 1);
    });
  }

  const start = query.pageIndex * query.pageSize;
  return { rowCount: rows.length, rows: rows.slice(start, start + query.pageSize) };
}
