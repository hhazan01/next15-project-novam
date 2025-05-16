"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import logo from "@/../public/aquarius.jpg";
import { useForm } from "react-hook-form";
import z from "zod";
import { SignInSchema } from "@/components/auth/auth-schema";
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
import Link from "next/link";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import FormError from "@/components/utils/form-error";
import FormSuccess from "@/components/utils/form-success";
import SignIn from "@/func/SignIn";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showTwoFactor, setShowTwoFactor] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<string | undefined>("");
  const [error, setError] = React.useState<string | undefined>("");
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(undefined);
      }, 3000);
    }

    if (success) {
      setTimeout(() => {
        setSuccess(undefined);
      }, 3000);
    }
  }, [error, success]);

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onSubmit = (data: z.infer<typeof SignInSchema>) => {
    setError(undefined);
    setSuccess(undefined);
    startTransition(async () => {
      await SignIn(data).then((res) => {
        if (res?.error) {
          return setError(res.error);
        }

        if (res?.twoFactor) {
          setShowTwoFactor(true);
        }
      });
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              {showTwoFactor && (
                <div className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña de un solo uso</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormDescription>
                          Ingrese la contraseña de un solo uso enviada a su
                          correo.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={"secondary"}
                      onClick={() => setShowTwoFactor(false)}
                    >
                      Volver atrás
                    </Button>
                    <Button type="submit" variant="default" className="w-full">
                      Comprobar
                    </Button>
                  </div>
                </div>
              )}
              {!showTwoFactor && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Bienvenido de nuevo</h1>
                    <p className="text-muted-foreground text-balance">NOVAM</p>
                  </div>
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
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel>Contraseña</FormLabel>
                          <Link
                            href="/auth/reset"
                            className="ml-auto text-xs underline-offset-2 hover:underline"
                          >
                            Olvidaste tu contraseña?
                          </Link>
                        </div>
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
                  <FormError message={error} />
                  <FormSuccess message={success} />
                  <Button type="submit" className="w-full">
                    Iniciar sesión
                  </Button>
                </div>
              )}
            </form>
          </Form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src={logo}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Al hacer clic en &quot;Iniciar sesión&quot;, aceptas nuestros{" "}
        <Link href="#">Términos de servicio</Link> y nuestra{" "}
        <Link href="#">Política de privacidad</Link>.
      </div>
    </div>
  );
}
