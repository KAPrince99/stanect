"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";

import { Input } from "./input";
import { Button } from "./button";
import { Sparkles, User, MapPin, Mic, Clock, Globe } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./select";
import { createCompanion } from "@/app/(app)/actions/actions";
import { getNames, getCode } from "country-list";
import * as Flags from "country-flag-icons/react/3x2";
import { AvatarProps, CreateCompanionProps, VoiceProps } from "@/types/types";
import AvatarDrawer from "./drawerDemo";
import {
  Choicebox,
  ChoiceboxIndicator,
  ChoiceboxItem,
  ChoiceboxItemHeader,
  ChoiceboxItemTitle,
} from "../kibo-ui/choicebox";

const formSchema = z.object({
  avatar_id: z.string().min(1, "Please select an avatar"),
  companion_name: z.string().min(2, "Name must be at least 2 characters"),
  scene: z.string().min(2, "Scene is required"),
  voice: z.enum(["male", "female"]),
  country: z.string().min(1, "Please select a country"),
  duration: z.string().regex(/^\d+$/, "Must be a number").min(1),
});

type FormData = z.infer<typeof formSchema>;

interface AvatarFormProps {
  avatars: AvatarProps[];
  selectedAvatarId: string | null;
}

export default function AvatarForm({
  avatars,
  selectedAvatarId,
}: AvatarFormProps) {
  const router = useRouter();
  const params = useSearchParams();
  const queryClient = useQueryClient();

  const urlAvatarId = params.get("avatarId");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(
    urlAvatarId || null
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar_id: selectedAvatarId || urlAvatarId || "",
      companion_name: "",
      scene: "",
      voice: undefined,
      country: "",
      duration: "15",
    },
    mode: "onBlur",
  });

  // Sync URL → form on mount
  useEffect(() => {
    if (selectedAvatarId) {
      form.setValue("avatar_id", selectedAvatarId);
      setSelectedAvatar(selectedAvatarId);
    }
  }, [selectedAvatarId, form]);

  // Update form and URL when avatar changes
  const handleAvatarSelect = (id: string) => {
    setSelectedAvatar(id);
    form.setValue("avatar_id", id, { shouldValidate: true });

    const searchParams = new URLSearchParams(params.toString());
    searchParams.set("avatarId", id);
    router.replace(`?${searchParams.toString()}`);
  };

  const mutation = useMutation({
    mutationFn: createCompanion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companions"] });
      toast.success("Your companion is alive", {
        description: "She’s ready when you are",
        icon: <Sparkles className="w-5 h-5" />,
      });
      setTimeout(() => router.replace("/dashboard"), 1200);
    },
    onError: () =>
      toast.error("Something went wrong", { description: "Please try again" }),
  });

  const onSubmit = (data: FormData) =>
    mutation.mutate(data as CreateCompanionProps);

  const countryOptions = useMemo(
    () =>
      getNames()
        .sort()
        .map((name) => {
          const code = getCode(name);
          const Flag = Flags[code];
          return { name, code, Flag };
        })
        .filter((c) => c.code),
    []
  );

  return (
    <div className="min-h-screen bg-transparent p-2 md:p-10 flex justify-center w-full max-w-2xl lg:min-h-0 lg:p-0">
      <div className="w-full ">
        {/* Header */}
        <div className="text-center mb-12 lg:hidden">
          <h1 className="text-5xl md:text-6xl font-display tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-white to-white/70">
            Bring Her to Life
          </h1>
          <p className="mt-4 text-white/70 text-md md:text-lg font-inter">
            One last step — give her a name, voice, and soul
          </p>
        </div>

        {/* Form */}
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-8 md:p-12 space-y-8 font-inter"
          >
            {/* Mobile Avatar Drawer */}
            <div className="lg:hidden space-y-4">
              <label className="text-white/90 font-inter flex items-center gap-2">
                <User className="w-5 h-5 text-amber-400" />
                Selected Avatar
              </label>
              <div className="flex items-center gap-4">
                <AvatarDrawer
                  avatars={avatars}
                  selected={selectedAvatar}
                  onSelect={handleAvatarSelect}
                />
                {selectedAvatar && (
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-emerald-400" />
                  </div>
                )}
              </div>
            </div>

            <Input
              name="avatar_Id"
              className="hidden"
              {...form.register("avatar_id")}
            />
            <InputField
              label="Her Name"
              placeholder="Sophia, Alex, Mia..."
              icon={<User className="w-5 h-5 text-amber-400" />}
              {...form.register("companion_name")}
            />
            {form.formState.errors.companion_name && (
              <p className="text-red-400 text-sm">
                {form.formState.errors.companion_name.message}
              </p>
            )}
            <InputField
              label="Where do you meet her?"
              icon={<MapPin className="w-5 h-5 text-blue-400" />}
              placeholder="Gym • Coffee Shop • Bar • Beach"
              {...form.register("scene")}
            />
            {form.formState.errors.scene && (
              <p className="text-red-400 text-sm">
                {form.formState.errors.scene.message}
              </p>
            )}

            <div>
              <div className="flex justify-start items-center gap-2 mb-4">
                <Mic className="w-5 h-5 text-purple-400" />
                <p className="font-inter ">Voice</p>
              </div>

              <Choicebox
                value={form.watch("voice")}
                onValueChange={(val: "male" | "female") =>
                  form.setValue("voice", val, { shouldValidate: true })
                }
                style={{
                  gridTemplateColumns: "repeat(2, 1fr)",
                }}
              >
                <ChoiceboxItem
                  value="male"
                  className={`border-2 rounded-sm transition cursor-pointer ${
                    form.watch("voice") === "male"
                      ? "border-amber-400 bg-amber-600/50"
                      : "border-white/10"
                  }`}
                >
                  <ChoiceboxItemHeader>
                    <ChoiceboxItemTitle>Male</ChoiceboxItemTitle>
                  </ChoiceboxItemHeader>
                  <ChoiceboxIndicator />
                </ChoiceboxItem>

                <ChoiceboxItem
                  value="female"
                  className={`border-2 rounded-sm transition cursor-pointer ${
                    form.watch("voice") === "female"
                      ? "border-amber-400 bg-amber-600/50"
                      : "border-white/10"
                  }`}
                >
                  <ChoiceboxItemHeader>
                    <ChoiceboxItemTitle>Female</ChoiceboxItemTitle>
                  </ChoiceboxItemHeader>
                  <ChoiceboxIndicator />
                </ChoiceboxItem>
              </Choicebox>

              {form.formState.errors.voice && (
                <p className="text-red-400 text-sm">
                  {form.formState.errors.voice.message}
                </p>
              )}
            </div>

            <SelectField
              label="Nationality"
              icon={<Globe className="w-5 h-5 text-cyan-400" />}
              value={form.watch("country")}
              onChange={(val) =>
                form.setValue("country", val, { shouldValidate: true })
              }
            >
              {countryOptions.map(({ name, Flag }) => (
                <SelectItem
                  key={name}
                  value={name}
                  className="flex items-center gap-2"
                >
                  <Flag className="w-6 h-4 rounded-sm object-cover" />
                  <span>{name}</span>
                </SelectItem>
              ))}
            </SelectField>

            {form.formState.errors.country && (
              <p className="text-red-400 text-sm">
                {form.formState.errors.country.message}
              </p>
            )}
            <InputField
              label="Session Length (minutes)"
              icon={<Clock className="w-5 h-5 text-amber-400" />}
              type="number"
              placeholder="15"
              {...form.register("duration")}
            />
            {form.formState.errors.duration && (
              <p className="text-red-400 text-sm">
                {form.formState.errors.duration.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={
                mutation.isPending || !form.formState.isValid || !selectedAvatar
              }
              className="w-full h-10 md:h-12 text-md font-bold bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black shadow-2xl shadow-amber-500/50 disabled:opacity-50"
            >
              {mutation.isPending
                ? "Creating her soul..."
                : "Create My Companion"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// --- Helper components ---
function InputField({ label, icon, ...props }: any) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-white/90 font-inter flex items-center gap-2">
          {icon}
          {label}
        </label>
      )}
      <Input
        {...props}
        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 placeholder:text-sm md:placeholder:text-md h-10 text-sm md:text-md"
      />
    </div>
  );
}

function SelectField({ label, icon, value, onChange, children }: any) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-white/90 font-inter flex items-center gap-2">
          {icon}
          {label}
        </label>
      )}
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="bg-white/10 border-white/20 text-white h-10 text-sm md:text-md">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );
}
