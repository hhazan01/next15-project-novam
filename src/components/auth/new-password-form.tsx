"use client";
import { z } from "zod";
import React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormError from "@/components/utils/form-error";
import FormSuccess from "@/components/utils/form-success";
import { newPassword } from "@/func/NewPassword";
import { NewPassowrdSchema } from "@/components/auth/auth-schema";

export default function NewPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const [isPending, startTransition] = React.useTransition();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  React.useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(undefined);
      }, 3600);
    }
  }, [error]);

  const form = useForm<z.infer<typeof NewPassowrdSchema>>({
    resolver: zodResolver(NewPassowrdSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPassowrdSchema>) => {
    setError(undefined);
    setSuccess(undefined);
    startTransition(async () => {
      await newPassword(values, token).then((res) => {
        if (res?.error) {
          return setError(res.error);
        }

        setTimeout(() => {
          router.push("/auth/login");
        }, 3600);
        form.reset();
        setSuccess(res.success);
      });
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>¿Olvidaste tu contraseña?</CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="*******"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {(error || success) && (
                  <div className="grid gap-2">
                    <FormError message={error} />
                    <FormSuccess message={success} />
                  </div>
                )}
                <Button type="submit" variant="default" className="w-full">
                  Cambiar contraseña
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
