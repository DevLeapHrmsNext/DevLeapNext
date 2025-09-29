import { Suspense } from "react";
import ApplyTaskApp from "./task-form";

export default function ApplyTaskPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApplyTaskApp />
    </Suspense>
  );
}