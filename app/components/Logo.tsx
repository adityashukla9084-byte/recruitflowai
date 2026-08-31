import Image from "next/image";

interface LogoProps {
  size?: number;
  showText?: boolean;
  textSize?: string;
  fontWeight?: string;
  className?: string;
}

export default function Logo({ 
  size = 28, 
  showText = true, 
  textSize = "text-sm", 
  fontWeight = "font-bold", 
  className = "" 
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div 
        className="relative overflow-hidden rounded-lg border border-white/[0.08] shadow-[0_0_12px_rgba(20,184,166,0.15)] flex items-center justify-center shrink-0 bg-zinc-950"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.png"
          alt="RecruitFlow AI Logo"
          width={size}
          height={size}
          className="object-cover"
        />
      </div>
      {showText && (
        <span className={`${textSize} ${fontWeight} bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-[#] bg-clip-text text-transparent tracking-tight`}>
          RecruitFlow AI
        </span>
      )}
    </div>
  );
}
