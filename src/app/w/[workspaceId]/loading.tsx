import { LoadingSkeleton } from "@/components/feedback/loading-skeleton";
import { PageContainer } from "@/components/layout/page-patterns";

export default function Loading() {
  return (
    <PageContainer>
      <LoadingSkeleton />
    </PageContainer>
  );
}
