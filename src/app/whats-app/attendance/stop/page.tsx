import { Suspense } from "react";
import AttendanceStopForm from "./stop-form";

export default function AttendanceStopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AttendanceStopForm />
    </Suspense>
  );
}