import { Suspense } from "react";
import HelloworkSearchContent from "./HelloworkSearchContent";

export default function HelloworkSearchPage() {
  return (
    <Suspense fallback={null}>
      <HelloworkSearchContent />
    </Suspense>
  );
}
