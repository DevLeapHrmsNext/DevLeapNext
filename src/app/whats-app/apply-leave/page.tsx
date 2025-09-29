import { Suspense } from "react";
import AssignLeave from "./assign-leave";

export default function ApplyLeavePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AssignLeave />
    </Suspense>
  );
}