import { notFound } from "next/navigation";

/** Any unknown path inside an edition renders that edition's 404 page (with a real 404 status). */
export default function CatchAll() {
  notFound();
}
