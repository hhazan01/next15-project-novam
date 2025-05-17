import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Users } from "@/hooks/use-users";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserSchema } from "../setting-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Roles } from "@/hooks/use-roles";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createUser } from "@/func/User";

interface UserDialogProps {
  user: Users | null;
  roles?: Roles[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefetch: () => void;
}

export default function UserDialog({
  user,
  roles,
  open,
  onOpenChange,
  onRefetch,
}: UserDialogProps) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      id: undefined,
      status: "",
      role: "",
      name: "",
      email: "",
      isTwoFactorEnabled: true,
    },
  });

  const handleAsyncOperation = async (
    operation: () => Promise<{ error?: string; success?: string }>
  ) => {
    startTransition(async () => {
      await operation().then((res) => {
        if (res.error) {
          return toast.error(res.error);
        }

        onRefetch();
        onOpenChange(false);
        toast.success(res.success);
      });
    });
  };

  const onSubmit = async (values: z.infer<typeof UserSchema>) => {
    await handleAsyncOperation(() => createUser(values));
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[750px]">
          <DialogHeader>
            <DialogTitle>Usuario</DialogTitle>
            <DialogDescription>
              Haz clic en Guardar cuando hayas terminado.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Type your message here."
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electronico</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Type your message here."
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estatus</FormLabel>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Estatus ..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A">Active</SelectItem>
                        <SelectItem value="S">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Role ..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles?.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Autenticación de dos factores</FormLabel>
                      <FormDescription>
                        Habilite la autenticación de dos factores para su
                        cuenta.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isPending}
                  >
                    Cerrar
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                  Guardar
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
