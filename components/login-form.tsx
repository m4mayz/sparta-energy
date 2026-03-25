"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    router.push("/")
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login ke SPARTA Energy</h1>
          <p className="text-sm text-muted-foreground">
            Masukkan email/NIK dan password untuk melanjutkan
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email / NIK</FieldLabel>
          <Input
            id="email"
            placeholder="contoh@sat.co.id / 12345678"
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Lupa password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            className="bg-background"
          />
        </Field>
        <FieldGroup>
          <Field orientation="horizontal">
            <Checkbox id="remember" defaultChecked />
            <FieldLabel htmlFor="remember" className="font-normal">
              Ingat saya
            </FieldLabel>
          </Field>
        </FieldGroup>
        <Field>
          <Button type="submit">Login</Button>
        </Field>
        <Field className="gap-1">
          <FieldDescription className="text-center text-xs">
            © 2026 Building & Maintenance System
          </FieldDescription>
          <FieldDescription className="text-center text-xs">
            Internal use only.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
