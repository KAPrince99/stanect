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

import { getNames, getCode } from "country-list";
import * as Flags from "country-flag-icons/react/3x2";

import { useMutation, useQueryClient } from "@tanstack/react-query";

// Map country names to SVG flag components
const countryOptions = getNames()
  .sort()
  .map((name) => {
    const code = getCode(name); // e.g., "US", "GB"
    const FlagComponent = (Flags as any)[code]; // dynamically get component
    return { name, FlagComponent };
  });

const formSchema = z.object({
  avatar_id: z.string().min(1, "Select an avatar"),
  companion_name: z.string().min(1, "Companion name is required"),
  scene: z.string().min(1, "scene is required"),
  voice: z.enum(["male", "female"], {
    message: "Please select a valid voice type",
  }),
  country: z.string().min(1, "Country is required"),
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
      companion_name: "",
      scene: "",
      voice: "",
      country: "",
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
      toast.error("❌ Failed to create companion", {
        style: { background: "#ff4d4f" },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["companions"],
        type: "all",
      });
      toast.success("Companion created successfully 🎉", {
        style: {
          background: "linear-gradient(135deg,#0072c3,#00c6ff])",
        },
      });

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  {...form.register("companion_name")}
                />
                <FieldError errors={[form.formState.errors.companion_name]} />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel>Scene</FieldLabel>
                <Input placeholder="Ex. Gym" {...form.register("scene")} />
                <FieldError errors={[form.formState.errors.scene]} />
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

            {/* Countries */}
            <FieldGroup>
              <Field>
                <FieldLabel>Country</FieldLabel>
                <Controller
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent className="max-h-72 overflow-y-auto">
                        <SelectGroup>
                          <SelectLabel>Countries</SelectLabel>
                          {countryOptions.map(({ name, FlagComponent }) => (
                            <SelectItem
                              key={name}
                              value={name}
                              className="flex items-center gap-2"
                            >
                              {FlagComponent && (
                                <FlagComponent className="w-5 h-5" />
                              )}
                              <span>{name}</span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[form.formState.errors.country]} />
              </Field>
            </FieldGroup>

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
