"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { Input } from "./input";
import { Button } from "./button";
import { DrawerDemo } from "./drawerDemo";
import LordIcon from "./lordIcon";

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

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./card";

import { AvatarProps, CreateCompanionProps } from "@/types/types";
import { createCompanion } from "@/app/(app)/actions/actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  avatar_id: z.string().min(1, "Select an avatar"),
  name: z.string().min(1, "Companion name is required"),
  venue: z.string().min(1, "Venue is required"),
  voice: z.string().min(1, "Voice is required"),
  style: z.string().min(1, "Style is required"),
  duration: z.string().min(1, "Minimum duration is 1 minute"),
});

interface AvatarFormProps {
  avatars: AvatarProps[];
}

export default function AvatarForm({ avatars }: AvatarFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useSearchParams();
  const urlSelected = params.get("avatarId");

  const [showAnimation, setShowAnimation] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar_id: "",
      name: "",
      venue: "",
      voice: "",
      style: "",
      duration: "15",
    },
  });

  // Sync avatarId from URL → form
  useEffect(() => {
    if (urlSelected) {
      form.setValue("avatar_id", urlSelected);
    }
  }, [urlSelected, form]);

  const mutation = useMutation({
    mutationFn: (data: CreateCompanionProps) => createCompanion(data),
    onMutate: async (newCompanion) => {
      await queryClient.cancelQueries({ queryKey: ["companions"] });
      const previousData = queryClient.getQueryData<AvatarProps[]>([
        "companions",
      ]);
      queryClient.setQueryData(["companions"], (old?: AvatarProps[]) => [
        ...(old || []),
        { id: "temp-id" + Math.random(), ...newCompanion },
      ]);
      return { previousData };
    },
    onError: (err, newCompanion, context) => {
      queryClient.setQueryData(["companions"], context?.previousData);
      toast.error("Failed to create companion");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["companions"],
        type: "all",
      });
      toast.success("Companion created successfully 🎉");

      router.replace("/dashboard");
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <main>
      <Card className="bg-stone-100">
        <CardHeader>
          <CardTitle className="text-2xl">Companion Builder</CardTitle>
          <CardDescription>
            Populate your companion information below
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="lg:hidden mt-4 mb-4">
              <p className="text-card-foreground text-[14px] font-medium">
                Avatar
              </p>

              <div className="flex gap-2 items-center">
                <DrawerDemo
                  setShowAnimation={setShowAnimation}
                  avatars={avatars}
                />

                {showAnimation && (
                  <LordIcon
                    src="https://cdn.lordicon.com/amtdygnu.json"
                    trigger="loop"
                    state="hover-pinch"
                    colors="primary:#16c72e,secondary:#16c72e"
                    width={40}
                    height={40}
                  />
                )}
              </div>
            </div>

            <Input type="hidden" {...form.register("avatar_id")} />
            <FieldError errors={[form.formState.errors.avatar_id]} />

            <FieldGroup>
              <Field>
                <FieldLabel>Companion Name</FieldLabel>
                <Input
                  placeholder="Enter the companion name"
                  {...form.register("name")}
                />
                <FieldError errors={[form.formState.errors.name]} />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel>Venue</FieldLabel>
                <Input placeholder="Ex. Gym" {...form.register("venue")} />
                <FieldError errors={[form.formState.errors.venue]} />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel>Voice</FieldLabel>

                <Controller
                  control={form.control}
                  name="voice"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
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
                  )}
                />

                <FieldError errors={[form.formState.errors.voice]} />
              </Field>
            </FieldGroup>

            {/* Style (SELECT) */}
            <FieldGroup>
              <Field>
                <FieldLabel>Style</FieldLabel>

                <Controller
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Style Types</SelectLabel>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />

                <FieldError errors={[form.formState.errors.style]} />
              </Field>
            </FieldGroup>

            {/* Duration */}
            <FieldGroup>
              <Field>
                <FieldLabel>Estimated session duration (minutes)</FieldLabel>

                <Input
                  type="text"
                  min={1}
                  placeholder="15"
                  {...form.register("duration", { valueAsNumber: false })}
                />

                <FieldError errors={[form.formState.errors.duration]} />
              </Field>
            </FieldGroup>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full cursor-pointer mt-2 flex items-center justify-center gap-2"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  <LordIcon
                    src="https://cdn.lordicon.com/amtdygnu.json"
                    trigger="loop"
                    state="hover-pinch"
                    colors="primary:#16c72e,secondary:#16c72e"
                    width={35}
                    height={35}
                  />
                </>
              ) : (
                "Create Companion"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
