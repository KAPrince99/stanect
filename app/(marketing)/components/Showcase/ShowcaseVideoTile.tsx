import MaskedDiv from "@/components/ui/masked-div";

interface ShowcaseVideoTileProps {
  src: string;
  size?: number;
  className?: string;
  maskType?: "type-1" | "type-2" | "type-3" | "type-4";
}

export function ShowcaseVideoTile({
  src,
  size,
  className,
  maskType = "type-1",
}: ShowcaseVideoTileProps) {
  return (
    <MaskedDiv maskType={maskType} size={size} className={className}>
      <video playsInline muted autoPlay loop preload="metadata">
        <source src={src} type="video/mp4" />
      </video>
    </MaskedDiv>
  );
}
