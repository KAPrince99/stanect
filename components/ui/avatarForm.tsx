"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "./input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Field, FieldError, FieldGroup, FieldLabel } from "./field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Button } from "./button";
import { DrawerDemo } from "./drawerDemo";

const formSchema = z.object({
  avatar: z.string().min(1, "avatar is required"),
  name: z.string().min(1, "companion is required"),
  venue: z.string().min(1, "venue is required"),
  voice: z.string().min(1, "Voice is required"),
  style: z.string().min(1, "Style is required"),
  duration: z.coerce.number().min(1, {
    message: "Duration must be at least 1",
  }),
});

export default function AvatarForm({
  urlSelected,
}: {
  urlSelected: string | null;
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: "",
      name: "",
      venue: "",
      voice: "",
      style: "",
      duration: 15,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Created SuccessFully");
  }
  return (
    <main>
      <Card className="bg-stone-100 ">
        <CardHeader>
          <CardTitle className="text-2xl">Companion Builder</CardTitle>
          <CardDescription>
            Populate your companion information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Input
              type="hidden"
              name="avatar"
              value={urlSelected !== null ? String(urlSelected) : ""}
            />

            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Companion Name</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter the companion name"
                      autoComplete="name"
                      className=""
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                name="venue"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Venue</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Ex. Gym"
                      autoComplete="venue"
                      className=""
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                name="voice"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Voice</FieldLabel>
                    <Select
                      aria-invalid={fieldState.invalid}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder="Select the voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Voice Types</SelectLabel>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                name="style"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Style</FieldLabel>
                    <Select
                      aria-invalid={fieldState.invalid}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder="Select the style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>style Types</SelectLabel>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                name="duration"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Estimated session duration in minutes
                    </FieldLabel>
                    <Input
                      {...field}
                      value={
                        field.value !== undefined ? Number(field.value) : ""
                      }
                      type="number"
                      aria-invalid={fieldState.invalid}
                      placeholder="15"
                      className="input"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <div className="lg:hidden mt-4">
              <DrawerDemo />
            </div>

            <Button type="submit" className="w-full cursor-pointer mt-2">
              Create Companion
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
