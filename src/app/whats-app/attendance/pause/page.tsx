import { Suspense } from "react";
import AttendancePauseForm from "./pause-form";

export default function AttendancePausePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AttendancePauseForm />
    </Suspense>
  );
}