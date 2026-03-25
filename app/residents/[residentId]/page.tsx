import { notFound } from "next/navigation";

import { ResidentDetailPage } from "@/components/residents/ResidentDetailPage";
import { getResidentDetailBySlug } from "@/lib/mock-data";

interface ResidentDetailRouteProps {
  params: Promise<{
    residentId: string;
  }>;
}

export default async function ResidentDetailRoute({
  params
}: ResidentDetailRouteProps) {
  const { residentId } = await params;
  const resident = getResidentDetailBySlug(residentId);

  if (!resident) {
    notFound();
  }

  return <ResidentDetailPage resident={resident} />;
}
