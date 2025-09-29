import { Suspense } from "react";
import DocUploadApp from "./doc-form";

export default function DocumentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocUploadApp />
    </Suspense>
  );
}