import React from "react";
import SettingComponent from "@/components/settings/setting-component";

export default function page() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-2 md:gap-6 md:py-3">
        <SettingComponent />
      </div>
    </div>
  );
}
