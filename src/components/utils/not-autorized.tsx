import React from "react";
import Image from "next/image";
import { LockIcon } from "lucide-react";
import logo from "@/../public/aquarius.jpg";

export default function NotAutorized() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <LockIcon className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Acceso no autorizado
        </h1>
        <p className="mt-4 text-muted-foreground">
          No tienes los permisos necesarios para acceder a este recurso.
          Comunícate con tu administrador para obtener ayuda.
        </p>
        <div className="flex items-center justify-center mt-6">
          <Image
            src={logo}
            alt="Unauthorized access illustration"
            className="dark:brightness-[0.2] dark:grayscale"
            width={300}
            height={300}
            priority
          />
        </div>
      </div>
    </div>
  );
}
