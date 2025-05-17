"use client";
import React from "react";
import Spinner from "@/components/utils/spinner";
import FormError from "@/components/utils/form-error";
import { Users, useUsers } from "@/hooks/use-users";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableUsers from "@/components/settings/users/data-table";
import { columns as colsUsers } from "@/components/settings/users/columns";
import { useRoles } from "@/hooks/use-roles";
import TableRoles from "@/components/settings/roles/data-table";
import { columns } from "@/components/settings/roles/columns";
import UserDialog from "@/components/settings/users/user-dialog";

export default function SettingComponent() {
  const {
    data: users,
    isLoading: islUsers,
    isError: isrUsers,
    error: errUsers,
    refetch: fetchUsers,
  } = useUsers();
  const {
    data: roles,
    isLoading: islRoles,
    isError: isrRoles,
    error: errRoles,
    refetch: fetchRoles,
  } = useRoles();
  const [dialogState, setDialogState] = React.useState<{
    open: boolean;
    user: Users | null;
  }>({
    open: false,
    user: null,
  });

  const columnsUser = colsUsers({
    onEdit: (user: Users) => setDialogState({ open: true, user }),
  });

  return (
    <div>
      <Tabs
        defaultValue="outline"
        className="w-full flex-col justify-start gap-6"
      >
        <div className="flex items-center justify-between px-4 lg:px-6">
          <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
            <TabsTrigger value="outline">Usuarios</TabsTrigger>
            <TabsTrigger value="past-performance">Roles</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="outline"
          className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        >
          {islUsers && <Spinner />}
          {users && (
            <TableUsers
              columns={columnsUser}
              data={users}
              onOpenChange={(open) => setDialogState({ open, user: null })}
            />
          )}
          {isrUsers && <FormError message={errUsers.message} />}
          <UserDialog
            user={dialogState.user}
            roles={roles}
            open={dialogState.open}
            onOpenChange={(open) => setDialogState({ open, user: null })}
            onRefetch={fetchUsers}
          />
        </TabsContent>
        <TabsContent
          value="past-performance"
          className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        >
          {islRoles && <Spinner />}
          {roles && <TableRoles columns={columns} data={roles} />}
          {isrRoles && <FormError message={errRoles.message} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
