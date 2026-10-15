import type { CSSProperties } from "react";
import { HandwerkPage } from "@/templates/handwerk-base/HandwerkPage";
import { HandwerkProvider } from "@/templates/handwerk-base/i18n";
import type { HandwerkBaseContent } from "@/lib/types/handwerk-base";
import type { TemplateProps } from "@/shared";

const EMPTY: HandwerkBaseContent = {
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

export default function HandwerkBaseTemplate({ data, locale }: TemplateProps) {
  const clay = data.branding.primaryColor;
  return (
    <div
      data-template="handwerk-base"
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
