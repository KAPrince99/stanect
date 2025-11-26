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
}

export default function AvatarForm({ avatars }: AvatarFormProps) {
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
      avatar_id: urlAvatarId || "",
      companion_name: "",
      scene: "",
      voice: undefined,
      country: "",
      duration: "15",
    },
  });

  // Sync URL → form on mount
  useEffect(() => {
    if (urlAvatarId) form.setValue("avatar_id", urlAvatarId);
  }, [urlAvatarId, form]);

  // Update form and URL when avatar changes
  const handleAvatarSelect = (id: string) => {
    setSelectedAvatar(id);
    form.setValue("avatar_id", id);

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
        style: {
          background: "linear-gradient(135deg, #1e40af, #3b82f6)",
          color: "white",
        },
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
          const Flag = (Flags as any)[code];
          return { name, code, Flag };
        })
        .filter((c) => c.code),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1a36] via-[#1a3a80] to-[#1e4ea8] p-6 md:p-10 flex justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
            Bring Her to Life
          </h1>
          <p className="mt-4 text-white/70 text-lg font-light">
            One last step — give her a name, voice, and soul
          </p>
        </div>

        {/* Form */}
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-8 md:p-12 space-y-8"
          >
            {/* Mobile Avatar Drawer */}
            <div className="lg:hidden space-y-4">
              <label className="text-white/90 font-medium flex items-center gap-2">
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

            {/* Desktop Avatar Selection */}
            {/* <DesktopAvatarSelection
              avatars={avatars}
              selected={selectedAvatar}
              onSelect={handleAvatarSelect}
            /> */}

            {/* Inputs */}

            <Input name="avatar_Id" className="hidden" />
            <InputField
              label="Her Name"
              placeholder="Sophia, Alex, Mia..."
              {...form.register("companion_name")}
            />
            <InputField
              label="Where do you meet her?"
              icon={<MapPin className="w-5 h-5 text-blue-400" />}
              placeholder="Gym • Coffee Shop • Bar • Beach"
              {...form.register("scene")}
            />
            <SelectField
              label="Voice"
              icon={<Mic className="w-5 h-5 text-purple-400" />}
              value={form.watch("voice")}
              onChange={(val) => form.setValue("voice", val)}
            >
              <SelectItem value="female">Fenale</SelectItem>
              <SelectItem value="male">Male</SelectItem>
            </SelectField>
            <SelectField
              label="Nationality"
              icon={<Globe className="w-5 h-5 text-cyan-400" />}
              value={form.watch("country")}
              onChange={(val) => form.setValue("country", val)}
            >
              {countryOptions.map(({ name, Flag }) => (
                <SelectItem
                  key={name}
                  value={name}
                  className="flex items-center gap-2"
                >
                  {Flag && <Flag className="w-6 h-4 rounded-sm" />}
                  {name}
                </SelectItem>
              ))}
            </SelectField>
            <InputField
              label="Session Length (minutes)"
              icon={<Clock className="w-5 h-5 text-amber-400" />}
              type="number"
              placeholder="15"
              {...form.register("duration")}
            />

            <Button
              type="submit"
              disabled={mutation.isPending || !form.formState.isValid}
              className="w-full h-16 text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black shadow-2xl shadow-amber-500/50 disabled:opacity-50"
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

// --- Desktop Avatar Selection ---
interface DesktopAvatarSelectionProps {
  avatars: AvatarProps[];
  selected: string | null;
  onSelect: (id: string) => void;
}

function DesktopAvatarSelection({
  avatars,
  selected,
  onSelect,
}: DesktopAvatarSelectionProps) {
  return (
    <div className="hidden lg:grid grid-cols-3 2xl:grid-cols-4 gap-6 max-w-7xl mx-auto mb-8">
      {avatars.map((avatar) => (
        <div
          key={avatar.id}
          className={`relative aspect-square rounded-3xl overflow-hidden cursor-pointer border-4 transition ${
            selected === avatar.id ? "border-amber-400" : "border-transparent"
          }`}
          onClick={() => onSelect(avatar.id)}
        >
          <Image
            src={avatar.image_url}
            alt={avatar.name || "Avatar"}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

// --- Helper components ---
function InputField({ label, icon, ...props }: any) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-white/90 font-medium flex items-center gap-2">
          {icon}
          {label}
        </label>
      )}
      <Input
        {...props}
        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-14 text-lg"
      />
    </div>
  );
}

function SelectField({ label, icon, value, onChange, children }: any) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-white/90 font-medium flex items-center gap-2">
          {icon}
          {label}
        </label>
      )}
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="bg-white/10 border-white/20 text-white h-14 text-lg">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );
}
