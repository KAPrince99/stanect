"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Loader2,
  Sparkles,
  User,
  MapPin,
  Mic,
  Clock,
  Globe,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

import { Input } from "./input";
import { Button } from "./button";
import { DrawerDemo } from "./drawerDemo";
import LordIcon from "./lordIcon";
import { getNames, getCode } from "country-list";
import * as Flags from "country-flag-icons/react/3x2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCompanion } from "@/app/(app)/actions/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const countryOptions = getNames()
  .sort()
  .map((name) => ({
    name,
    code: getCode(name),
    Flag: (Flags as any)[getCode(name)],
  }))
  .filter((c) => c.code);

const formSchema = z.object({
  avatar_id: z.string().min(1, "Please select an avatar"),
  companion_name: z.string().min(2, "Name must be at least 2 characters"),
  scene: z.string().min(2, "Scene is required (e.g. Gym, Bar, Beach)"),
  voice: z.enum(["male", "female"]),
  country: z.string().min(1, "Please select a country"),
  duration: z
    .string()
    .regex(/^\d+$/, "Must be a number")
    .min(1, "At least 1 minute"),
});

type FormData = z.infer<typeof formSchema>;

interface AvatarFormProps {
  avatars: { id: string; image_url: string }[];
}

export default function AvatarForm({ avatars }: AvatarFormProps) {
  const router = useRouter();
  const params = useSearchParams();
  const urlAvatarId = params.get("avatarId");
  const queryClient = useQueryClient();

  const [showSuccess, setShowSuccess] = useState(false);

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

  useEffect(() => {
    if (urlAvatarId) form.setValue("avatar_id", urlAvatarId);
  }, [urlAvatarId, form]);

  const mutation = useMutation({
    mutationFn: createCompanion,
    onSuccess: () => {
      setShowSuccess(true);
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
    onError: () => {
      toast.error("Something went wrong", {
        description: "Please try again",
        style: { background: "#dc2626" },
      });
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data as any);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1a36] via-[#1a3a80] to-[#1e4ea8] p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent"
          >
            Bring Her to Life
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-white/70 text-lg font-light"
          >
            One last step — give her a name, voice, and soul
          </motion.p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
        >
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-8 md:p-12 space-y-10"
          >
            {/* Avatar Picker */}
            <div className="space-y-4">
              <label className="text-white/90 font-medium flex items-center gap-3">
                <User className="w-5 h-5 text-amber-400" />
                Selected Avatar
              </label>
              <div className="flex items-center gap-6">
                <DrawerDemo avatars={avatars} />
                {form.watch("avatar_id") && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center"
                  >
                    <Sparkles className="w-8 h-8 text-emerald-400" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-3">
              <label className="text-white/90 font-medium">Her Name</label>
              <Input
                placeholder="Sophia, Alex, Mia..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-14 text-lg"
                {...form.register("companion_name")}
              />
            </div>

            {/* Scene */}
            <div className="space-y-3">
              <label className="text-white/90 font-medium flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                Where do you meet her?
              </label>
              <Input
                placeholder="Gym • Coffee Shop • Bar • Beach"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-14 text-lg"
                {...form.register("scene")}
              />
            </div>

            {/* Voice */}
            <div className="space-y-3">
              <label className="text-white/90 font-medium flex items-center gap-2">
                <Mic className="w-5 h-5 text-purple-400" />
                Voice
              </label>
              <Controller
                control={form.control}
                name="voice"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white h-14 text-lg">
                      <SelectValue placeholder="Choose her voice..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female" className="text-lg">
                        Female (Warm & Playful)
                      </SelectItem>
                      <SelectItem value="male" className="text-lg">
                        Male (Deep & Confident)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Country */}
            <div className="space-y-3">
              <label className="text-white/90 font-medium flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                Nationality
              </label>
              <Controller
                control={form.control}
                name="country"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white h-14 text-lg">
                      <SelectValue placeholder="Where is she from?" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {countryOptions.map(({ name, Flag }) => (
                        <SelectItem
                          key={name}
                          value={name}
                          className="flex items-center gap-3 text-base"
                        >
                          {Flag && <Flag className="w-6 h-4 rounded-sm" />}
                          <span>{name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <label className="text-white/90 font-medium flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Session Length (minutes)
              </label>
              <Input
                type="number"
                placeholder="15"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-14 text-lg"
                {...form.register("duration")}
              />
            </div>

            {/* Submit */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={mutation.isPending || !form.formState.isValid}
                className="w-full h-16 text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black shadow-2xl shadow-amber-500/50 disabled:opacity-50"
              >
                {mutation.isPending ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin" />
                    <span>Creating her soul...</span>
                  </div>
                ) : showSuccess ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-3"
                  >
                    <Sparkles className="w-6 h-6" />
                    She’s alive!
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    Create My Companion
                  </div>
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>

        {/* Success Animation */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
            >
              <motion.div
                animate={{ y: [0, -30, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-9xl"
              >
                <LordIcon
                  src="https://cdn.lordicon.com/amtdygnu.json"
                  trigger="loop"
                  state="hover-pinch"
                  colors="primary:#facc15,secondary:#f59e0b"
                  width={35}
                  height={35}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
