import { cn } from "@/components/templates/clinic-premium/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  dark = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <span
        className={cn(
          "pill",
          dark && "border-white/15 bg-white/10 text-mint backdrop-blur",
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-mint" />
        {eyebrow}
      </span>
      <h2 className={cn("heading-lg mt-5", dark && "text-white")}>{title}</h2>
      {subtitle && (
        <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", dark ? "text-white/70" : "text-muted")}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
