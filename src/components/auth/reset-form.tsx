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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reset } from "@/func/Reset";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormError from "@/components/utils/form-error";
import FormSuccess from "@/components/utils/form-success";
import { useRouter } from "next/navigation";
import { ResetSchema } from "@/components/auth/auth-schema";

export default function ResetForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(undefined);
      }, 3000);
    }
  }, [error]);

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError(undefined);
    setSuccess(undefined);
    startTransition(async () => {
      await reset(values).then((res) => {
        if (res?.error) {
          return setError(res?.error);
        }

        setTimeout(() => {
          router.push("/auth/login");
        }, 3600);
        form.reset();
        setSuccess(res?.success);
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">
                          Correo electrónico
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="john.doe@movilnet.com.ve"
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
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={"secondary"}
                    className="w-full"
                    onClick={() => router.back()}
                  >
                    Volver atrás
                  </Button>
                  <Button type="submit" variant="default" className="w-full">
                    Verificar
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
