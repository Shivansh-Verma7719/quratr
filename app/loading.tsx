import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh_-_123px)]">
      <Spinner size="lg" />
    </div>
  );
}