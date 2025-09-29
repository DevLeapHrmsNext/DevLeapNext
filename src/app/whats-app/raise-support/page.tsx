import { Suspense } from "react";
import SupportRequestForm from "./support-form";

export default function SupportPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SupportRequestForm />
    </Suspense>
  );
}