import { Suspense } from "react";
import LeaveList from "./leave-list";

export default function LeaveDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeaveList />
    </Suspense>
  );
}