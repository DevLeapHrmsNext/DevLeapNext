import { Suspense } from "react";
import SupportList from "./support-list";

export default function SupportDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SupportList />
    </Suspense>
  );
}