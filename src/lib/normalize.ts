/**
 * Lower-case + strip diacritics, so "compania" typed without accents matches
 * "Compañía".
 *
 * Use it on BOTH sides of a client-side match (the query and the candidate).
 * It only covers client-side filtering: a server search such as Postgres
 * `ILIKE` does not fold accents, so results fetched by `?search=` can still
 * differ.
 */
export const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
