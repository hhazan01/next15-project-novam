"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ExtendedUser } from "@/../next-auth";
import { LogOut } from "lucide-react";
import SignOut from "@/func/SignOut";

interface NavActionsProps {
  session: ExtendedUser;
}

export function NavActions({ session }: NavActionsProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="hidden font-medium text-muted-foreground md:inline-block">
        {session.name}
      </div>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={SignOut}>
        <LogOut />
      </Button>
    </div>
  );
}
