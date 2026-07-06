"use client";

import { useRouter } from "next/navigation";
import { UserStatus } from "@prisma/client";
import { toggleUserStatus } from "@/lib/actions/admin";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { isDemoAccountEmail } from "@/lib/demo-accounts";

type UserStatusToggleProps = {
  userId: string;
  status: UserStatus;
  email: string;
};

export function UserStatusToggle({ userId, status, email }: UserStatusToggleProps) {
  const router = useRouter();
  const isActive = status === "ACTIVE";
  const isDemo = isDemoAccountEmail(email);

  if (isDemo) {
    return (
      <span className="text-xs text-neutral-400" title="Demo accounts stay active">
        Demo account
      </span>
    );
  }

  return (
    <ConfirmDialog
      title={isActive ? "Suspend user?" : "Reactivate user?"}
      message={
        isActive
          ? "This user will lose access to the dashboard until reactivated."
          : "This user will regain access to the platform."
      }
      confirmLabel={isActive ? "Suspend" : "Reactivate"}
      variant={isActive ? "danger" : "primary"}
      onConfirm={async () => {
        await toggleUserStatus(userId);
        router.refresh();
      }}
      trigger={
        <button
          type="button"
          className={`text-xs font-medium ${
            isActive
              ? "text-danger-500 hover:text-danger-500/80"
              : "text-accent-600 hover:text-accent-600/80"
          }`}
        >
          {isActive ? "Suspend" : "Reactivate"}
        </button>
      }
    />
  );
}
