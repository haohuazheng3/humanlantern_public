import { getDict } from "@/i18n";
import { LOCALES } from "@/i18n/config";
import { NotFoundView } from "@/components/NotFoundView";

/** 404 inside an edition: same chrome, the edition's own words (picked from the URL on the client). */
export default function NotFound() {
  const copy = Object.fromEntries(LOCALES.map((l) => [l, getDict(l).notFound]));
  return <NotFoundView copy={copy} />;
}
