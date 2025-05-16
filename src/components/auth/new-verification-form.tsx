"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/func/NewVerification";
import Spinner from "@/components/utils/spinner";
import FormError from "@/components/utils/form-error";
import FormSuccess from "@/components/utils/form-success";
import Link from "next/link";

export function NewVerificationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = React.useCallback(async () => {
    if (success || error) return;

    if (!token) {
      setError("Missing token!");
      return;
    }

    await newVerification(token)
      .then((data) => {
        setError(data.error);
        setSuccess(data.success);
      })
      .catch(() => {
        setError("Something went wron!");
      });
  }, [token, success, error]);

  React.useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Confirmando su verificación</CardTitle>
          <CardDescription>Verficando</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!success && !error && <Spinner />}
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="button" variant="default">
            <Link href={"/auth/login"}>Iniciar sesión</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
