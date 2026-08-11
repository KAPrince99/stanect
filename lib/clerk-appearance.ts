/** Shared Clerk theming for Stanect auth surfaces (login / sign-up). */
export const stanectClerkAppearance = {
  variables: {
    colorPrimary: "#e88c30",
    colorBackground: "transparent",
    colorInputBackground: "rgba(255,255,255,0.06)",
    colorInputText: "#ffffff",
    colorText: "#ffffff",
    colorTextSecondary: "rgba(255,255,255,0.6)",
    colorTextOnPrimaryBackground: "#0b1a36",
    colorDanger: "#f87171",
    colorSuccess: "#34d399",
    colorNeutral: "rgba(255,255,255,0.7)",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    fontFamilyButtons:
      "var(--font-display), ui-sans-serif, system-ui, sans-serif",
  },
  elements: {
    rootBox: "w-full",
    card: "w-full border-0 bg-transparent shadow-none",
    cardBox: "w-full shadow-none",
    headerTitle:
      "font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-white",
    headerSubtitle: "text-white/55",
    socialButtonsBlockButton:
      "h-11 border border-white/25 bg-white text-[#0b1a36] shadow-sm hover:bg-white/90",
    socialButtonsBlockButtonText:
      "font-semibold text-[#0b1a36]",
    socialButtonsProviderIcon: "opacity-100",
    dividerLine: "bg-white/15",
    dividerText: "text-white/45",
    formFieldLabel: "text-white/70",
    formFieldInput:
      "border border-white/15 bg-white/5 text-white placeholder:text-white/35 focus:border-amber-400/50 focus:ring-amber-400/20",
    formButtonPrimary:
      "bg-[#e88c30] text-black font-semibold shadow-none hover:bg-[#f0a45a]",
    footerActionLink: "text-amber-300 hover:text-amber-200",
    footerActionText: "text-white/50",
    identityPreviewEditButton: "text-amber-300",
    formFieldInputShowPasswordButton: "text-white/50 hover:text-white",
    otpCodeFieldInput: "border border-white/15 bg-white/5 text-white",
    alertText: "text-white",
    formFieldErrorText: "text-red-300",
  },
} as const;
