import { CheckDetailClient } from "@/components/screens/check-detail-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CheckDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <CheckDetailClient checkId={id} />;
}
