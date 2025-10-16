import { Suspense } from "react";
import AttendanceResumeForm from "./resume-form";

export default function AttendanceResumePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AttendanceResumeForm />
    </Suspense>
  );
}