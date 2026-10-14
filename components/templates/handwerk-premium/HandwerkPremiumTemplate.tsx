import type { CSSProperties } from "react";
import { HandwerkPage } from "@/components/templates/handwerk-premium/HandwerkPage";
import { HandwerkProvider } from "@/components/templates/handwerk-premium/i18n";
import type { HandwerkPremiumContent } from "@/lib/types/handwerk-premium";
import type { TemplateProps } from "@/components/templates/shared";

const EMPTY: HandwerkPremiumContent = {
  sample: false,
  present: {
    hero: true,
    services: false,
    guarantees: false,
    projects: false,
    reviews: false,
    quality: false,
    team: false,
    beforeAfter: false,
    financing: false,
    process: false,
    faq: false,
    contact: false,
    materials: false,
  },
  serviceItems: [],
};

export default function HandwerkPremiumTemplate({ data, locale }: TemplateProps) {
  const clay = data.branding.primaryColor;
  return (
    <div
      data-template="handwerk-premium"
      id="top"
      className="min-h-screen antialiased"
      style={clay ? ({ ["--hw-clay"]: clay } as CSSProperties) : undefined}
    >
      <HandwerkProvider locale={locale} brandName={data.branding.name} content={data.handwerk ?? EMPTY}>
        <HandwerkPage />
      </HandwerkProvider>
    </div>
  );
}
