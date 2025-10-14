import { Suspense } from "react";
import AttendanceStartForm from "./start-form";

export default function AttendanceStartPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AttendanceStartForm />
    </Suspense>
  );
}