import Image from "next/image";
import { cn } from "@/components/templates/clinic-premium/utils";

function initials(name: string) {
  return name
    .replace(/^(dr\.?|prof\.?|med\.?)\s+/gi, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/** Photo when we have one, otherwise a neutral initials tile (never somebody else's photo). */
export function Avatar({
  src,
  name,
  sizes,
  className,
  imageClassName,
}: {
  src?: string;
  name: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
}) {
  if (src) {
    return <Image src={src} alt={name} fill sizes={sizes} className={cn("object-cover", imageClassName)} />;
  }
  return (
    <span
      aria-hidden
      className={cn(
        "absolute inset-0 grid place-items-center bg-gradient-to-br from-brand-700 to-brand-900 font-extrabold text-mint",
        className,
      )}
    >
      {initials(name) || "+"}
    </span>
  );
}
