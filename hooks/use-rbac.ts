"use client"

import { useCallback } from "react"
import { useAuth } from "@/providers/auth-provider"

type Permission = {
  action: string
  subject: string
}

const rolePermissions = {
  admin: ["*"],
  ADMIN: [
    "read:*",
    "create:employee",
    "update:employee",
    "delete:employee",
    "manage:attendance",
    "manage:leave",
    "read:billing",
  ],
  MANAGER: ["read:employee", "read:attendance", "approve:leave", "read:reports"],
}

export function useRBAC() {
  const { user } = useAuth();

  const can = useCallback(
    (action: string, subject: string) => {
      if (!user) {
        console.warn('No user found in authentication context');
        return false;
      }

      if (!user.role) {
        console.warn('User has no role assigned');
        return false;
      }

      const role = user.role as keyof typeof rolePermissions;
      const permissions = rolePermissions[role];

      if (!permissions) {
        console.warn(`No permissions defined for role: ${role}`);
        return false;
      }

      return permissions.some((permission) => {
        if (permission === "*") return true;
        
        const [permAction, permSubject] = permission.split(":");
        return (permAction === "*" || permAction === action) && 
               (permSubject === "*" || permSubject === subject);
      });
    },
    [user?.role]
  );

  return { can };
}

