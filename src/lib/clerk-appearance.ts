/**
 * Clerk components sit inside an always-dark floating slab (.slab-ink), so they use one
 * fixed dark palette that matches the brand in both site themes.
 */
export const clerkAppearance = {
  variables: {
    colorPrimary: "#ff8a3d",
    colorPrimaryForeground: "#1f0e03",
    colorBackground: "#120f0c",
    colorForeground: "#f6f0e8",
    colorMuted: "#28231c",
    colorMutedForeground: "#b2a798",
    colorInput: "#1e1a15",
    colorInputForeground: "#f6f0e8",
    colorBorder: "rgba(255, 236, 214, 0.18)",
    colorRing: "#ff8a3d",
    colorDanger: "#ff9184",
    colorSuccess: "#7fd9ab",
    colorNeutral: "#f6f0e8",
    colorShimmer: "rgba(255,255,255,0.08)",
    borderRadius: "14px",
    fontFamily: "var(--font-instrument), ui-sans-serif, system-ui, sans-serif",
    fontSize: "16px",
  },
  elements: {
    rootBox: "!w-full !min-w-0",
    cardBox: "!w-full !max-w-full !min-w-0 !shadow-none !border-0 !bg-transparent",
    card: "!w-full !min-w-0 !bg-transparent !shadow-none !border-0 !p-0",
    footer: "!bg-transparent !bg-none [&_*]:!bg-transparent",
    footerAction: "hidden",
    formFieldInput: "!min-h-[50px] !text-[16px]",
    formButtonPrimary: "!min-h-[50px] !rounded-full !text-[1rem] !font-semibold active:!scale-[0.97] !transition-transform",
    otpCodeFieldInput: "!min-h-[52px] !text-[1.2rem]",
    formResendCodeLink: "!text-[#ff9b57]",
    identityPreviewEditButton: "!text-[#ff9b57]",
  },
} as const;
