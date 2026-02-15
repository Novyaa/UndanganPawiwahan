import { Suspense } from "react";
import HalamanInti from "./HalamanInti";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HalamanInti />
    </Suspense>
  );
}
