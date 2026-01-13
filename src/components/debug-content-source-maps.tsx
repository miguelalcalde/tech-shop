"use client";

import { useEffect, useState } from "react";

interface DebugContentSourceMapsProps {
  content: string;
  fieldName: string;
}

export function DebugContentSourceMaps({
  content,
  fieldName,
}: DebugContentSourceMapsProps) {
  const [hasMetadata, setHasMetadata] = useState(false);

  useEffect(() => {
    // Check if the content contains Unicode metadata markers
    // Content Source Maps use invisible Unicode characters
    const hasInvisibleChars = /[\u200B-\u200D\uFEFF]/g.test(content);
    setHasMetadata(hasInvisibleChars);
  }, [content]);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 bg-black text-white p-3 rounded-lg text-xs font-mono max-w-xs z-50">
      <div className="font-bold mb-1">🔍 Content Source Maps Debug</div>
      <div className="space-y-1">
        <div>
          Field: <span className="text-yellow-400">{fieldName}</span>
        </div>
        <div>
          Metadata: {hasMetadata ? (
            <span className="text-green-400">✓ Found</span>
          ) : (
            <span className="text-red-400">✗ Not found</span>
          )}
        </div>
        <div className="text-xs text-gray-400 mt-2">
          {hasMetadata
            ? "Edit Mode should work!"
            : "Enable Draft Mode first"}
        </div>
      </div>
    </div>
  );
}

