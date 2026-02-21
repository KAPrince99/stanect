"use client";

import { useState, useEffect, useMemo, memo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Input } from "./input";
import { Button } from "./button";
import { Sparkles, User, ShieldCheck, Crown } from "lucide-react"; // Added Crown
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
import { AvatarProps } from "@/types/types";
import AvatarDrawer from "./drawerDemo";
import {
  Choicebox,
  ChoiceboxIndicator,
  ChoiceboxItem,
  ChoiceboxItemHeader,
  ChoiceboxItemTitle,
} from "../kibo-ui/choicebox";
import LordIcon from "./lordIcon";

interface AvatarFormProps {
  avatars: AvatarProps[];
  selectedAvatarId: string | null;
  userPlan?: "free" | "pro" | "king"; // Made optional with default
}

function AvatarForm({
  avatars,
  selectedAvatarId,
  userPlan = "free",
}: AvatarFormProps) {
  const router = useRouter();
  const params = useSearchParams();
  const queryClient = useQueryClient();

  const urlAvatarId = params.get("avatarId");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(
    urlAvatarId || null,
  );

  // Dynamic limits based on prop
  const maxMinutes = useMemo(() => {
    if (userPlan === "king") return 60;
    if (userPlan === "pro") return 15;
    return 2;
  }, [userPlan]);

  const formSchema = useMemo(
    () =>
      z.object({
        avatar_id: z.string().min(1, "Please select an avatar"),

        companion_name: z
          .string()
          .trim()
          .min(2, "Name must be at least 2 characters")
          .max(40, "Name too long"),

        scene: z
          .string()
          .trim()
          .min(2, "Scene is required")
          .max(120, "Scene too long"),

        voice: z.enum(["male", "female"], {
          required_error: "Select a voice",
        }),

        country: z.string().min(1, "Please select a country"),

        duration: z.preprocess(
          (val) => (val === "" ? undefined : Number(val)),
          z
            .number({ invalid_type_error: "Enter a number" })
            .int("Please enter a whole number")
            .min(1, "Min 1 minute")
            .max(
              maxMinutes,
              `Your ${userPlan} plan limit is ${maxMinutes} mins`,
            ),
        ),
      }),
    [maxMinutes, userPlan],
  );
  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar_id: selectedAvatarId || urlAvatarId || "",
      companion_name: "",
      scene: "",
      voice: "female",
      country: "",
      duration: maxMinutes,
    },
    mode: "onBlur",
  });

  // Re-sync duration if userPlan changes (e.g. after upgrade)
  useEffect(() => {
    form.setValue("duration", maxMinutes);
  }, [maxMinutes, form]);

  useEffect(() => {
    if (selectedAvatarId) {
      form.setValue("avatar_id", selectedAvatarId);
      setSelectedAvatar(selectedAvatarId);
    }
  }, [selectedAvatarId, form]);

  const handleAvatarSelect = (id: string) => {
    setSelectedAvatar(id);
    form.setValue("avatar_id", id, { shouldValidate: true });
    const searchParams = new URLSearchParams(params.toString());
    searchParams.set("avatarId", id);
    router.replace(`?${searchParams.toString()}`);
  };

  const mutation = useMutation({
    mutationFn: createCompanion,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["companions"] });
      toast.success("Your companion is alive", {
        icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      });
      setTimeout(() => router.replace("/dashboard"), 1200);
    },
    onError: (err: any) => toast.error(err.message || "Something went wrong"),
  });

  const onSubmit = (data: FormData) => mutation.mutate(data as any);

  const countryOptions = useMemo(
    () =>
      getNames()
        .sort()
        .map((name) => {
          const code = getCode(name);
          const Flag = Flags[code as keyof typeof Flags];
          return { name, code, Flag };
        })
        .filter((c) => c.code && c.Flag),
    [],
  );

  return (
    <div className="min-h-screen bg-transparent p-2 md:p-10 flex justify-center w-full max-w-2xl lg:min-h-0 lg:p-0">
      <div className="w-full">
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-8 md:p-12 space-y-8 font-inter"
          >
            {/* Mobile Avatar Selection */}
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
              </div>
            </div>

            <InputField
              label="Her Name"
              placeholder="Sophia,Alex,Mia..."
              icon={
                <LordIcon
                  src="https://cdn.lordicon.com/hhljfoaj.json"
                  trigger="loop"
                  colors="primary:#e88c30,secondary:#e88c30,tertiary:#e88c30"
                  height={25}
                  width={25}
                />
              }
              {...form.register("companion_name")}
            />

            <InputField
              label="Meeting Scene"
              placeholder="Gym • Coffee Shop"
              icon={
                <LordIcon
                  src="https://cdn.lordicon.com/dhmavvpz.json"
                  trigger="loop"
                  colors="primary:#e88c30,secondary:#e88c30"
                  height={25}
                  width={25}
                />
              }
              {...form.register("scene")}
            />

            {/* Voice */}
            <div>
              <div className="flex justify-start items-center gap-2 mb-4">
                <LordIcon
                  src="https://cdn.lordicon.com/ckooqaow.json"
                  trigger="loop"
                  colors="primary:#e88c30,secondary:#e88c30,tertiary:#e88c30,quaternary:#ebe6ef,quinary:#f24c00"
                  height={25}
                  width={25}
                />
                <p className="font-inter">Voice</p>
              </div>
              <Choicebox
                value={form.watch("voice")}
                onValueChange={(val: "male" | "female") =>
                  form.setValue("voice", val, { shouldValidate: true })
                }
                style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
              >
                <ChoiceboxItem
                  value="male"
                  className={`border-2 rounded-sm transition cursor-pointer ${form.watch("voice") === "male" ? "border-amber-400 bg-amber-600/50" : "border-white/10"}`}
                >
                  <ChoiceboxItemHeader>
                    <ChoiceboxItemTitle>Male</ChoiceboxItemTitle>
                  </ChoiceboxItemHeader>
                  <ChoiceboxIndicator />
                </ChoiceboxItem>
                <ChoiceboxItem
                  value="female"
                  className={`border-2 rounded-sm transition cursor-pointer ${form.watch("voice") === "female" ? "border-amber-400 bg-amber-600/50" : "border-white/10"}`}
                >
                  <ChoiceboxItemHeader>
                    <ChoiceboxItemTitle>Female</ChoiceboxItemTitle>
                  </ChoiceboxItemHeader>
                  <ChoiceboxIndicator />
                </ChoiceboxItem>
              </Choicebox>
            </div>

            {/* Nationality */}
            <SelectField
              label="Nationality"
              icon={
                <LordIcon
                  src="https://cdn.lordicon.com/tyntlpjn.json"
                  trigger="loop"
                  colors="primary:#ffffff,secondary:#e88c30"
                  height={25}
                  width={25}
                />
              }
              value={form.watch("country")}
              onChange={(val: string) =>
                form.setValue("country", val, { shouldValidate: true })
              }
            >
              {countryOptions.map(({ name, Flag }: any) => (
                <SelectItem
                  key={name}
                  value={name}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-2">
                    <Flag className="w-5 h-3 rounded-sm" />
                    <span>{name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectField>

            {/* DURATION FIELD */}
            <div className="space-y-2">
              <InputField
                label="Session Length (minutes)"
                type="number"
                placeholder={`1 - ${maxMinutes}`}
                icon={
                  <LordIcon
                    src="https://cdn.lordicon.com/zjuyeglr.json"
                    trigger="loop"
                    colors="primary:#e88c30,secondary:#e88c30"
                    height={25}
                    width={25}
                  />
                }
                {...form.register("duration")}
              />
              <div className="flex items-center gap-2 px-1">
                {userPlan === "free" ? (
                  <ShieldCheck className="w-3 h-3 text-amber-500" />
                ) : (
                  <Crown className="w-3 h-3 text-emerald-400 animate-pulse" />
                )}
                <p
                  className={`text-[10px] uppercase tracking-widest font-bold ${userPlan === "free" ? "text-white/50" : "text-emerald-400"}`}
                >
                  {userPlan.toUpperCase()} Plan: Max {maxMinutes} Mins
                </p>
              </div>
              {form.formState.errors.duration && (
                <p className="text-red-400 text-xs mt-1">
                  {form.formState.errors.duration.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={
                mutation.isPending || !form.formState.isValid || !selectedAvatar
              }
              className="w-full h-12 bg-linear-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-bold rounded-2xl shadow-xl shadow-amber-500/20 transition-all active:scale-95"
            >
              {mutation.isPending
                ? "Creating Soul..."
                : "Create into Existence"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// --- Helpers ---
function InputField({ label, icon, className, ...props }: any) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-white/90 text-sm font-medium flex items-center gap-2">
          {icon} {label}
        </label>
      )}
      <Input
        {...props}
        className={`bg-white/5 border-white/10 text-white h-11 rounded-xl focus:ring-amber-500/50 placeholder:text-white/50 ${className}`}
      />
    </div>
  );
}

function SelectField({ label, icon, value, onChange, children }: any) {
  return (
    <div className="space-y-2">
      <label className="text-white/90 text-sm font-medium flex items-center gap-2">
        {icon} {label}
      </label>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="bg-white/5 border-white/10 text-white h-11 rounded-xl">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-white/10 text-white">
          {children}
        </SelectContent>
      </Select>
    </div>
  );
}
export default memo(AvatarForm);
