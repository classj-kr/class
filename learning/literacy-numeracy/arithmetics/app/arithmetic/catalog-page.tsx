import { headers } from "next/headers";
import ArithmeticCatalog, { type CatalogStage } from "./catalog";

type CatalogPageProps = {
  searchParams: Promise<{ stage?: string | string[] }>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const requestHeaders = await headers();
  const params = await searchParams;
  const requested = typeof params.stage === "string" ? params.stage : undefined;
  const stage = requested && ["elementary", "middle", "high", "stem", "all"].includes(requested)
    ? requested : requestHeaders.get("x-class-school-level");
  const initialStage: CatalogStage = stage === "middle" || stage === "high" || stage === "stem" || stage === "all"
    ? stage : "elementary";
  return <ArithmeticCatalog initialStage={initialStage} />;
}
