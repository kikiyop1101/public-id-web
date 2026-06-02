import type { SVGProps } from "react";

function Svg({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export function Check(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M20 6 9 17l-5-5" />
    </Svg>
  );
}

export function ArrowRight(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  );
}

export function Mascot(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="9" r="5" />
      <path d="M9.5 8.5h.01M14.5 8.5h.01M10 11c.9.7 3.1.7 4 0" />
      <path d="M5 21c1-3 4-4.5 7-4.5s6 1.5 7 4.5" />
    </Svg>
  );
}

export function Webtoon(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M9 9v11" />
    </Svg>
  );
}

export function Palette(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="8.5" cy="9.5" r="1" />
      <circle cx="15.5" cy="9.5" r="1" />
      <circle cx="9.5" cy="15.5" r="1" />
      <path d="M12 3c-1 4 6 3 6 7 0 3-3 5-6 5" />
    </Svg>
  );
}

export function Shield(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </Svg>
  );
}

export function Footprint(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M8 4c2 0 3.2 2 3.2 5S10 14 8 14s-3-1-3-4 1-6 3-6Z" />
      <path d="M5 18.5c0 1.6 1.1 2.5 2.5 2.5s2.5-1 2.5-2.5" />
      <path d="M17 8c1.4 0 2.2 1.4 2.2 3.5S18 16 16.6 16" />
    </Svg>
  );
}

export function Bollard(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M8 21h8" />
      <path d="M9.5 21V8a2.5 2.5 0 0 1 5 0v13" />
      <path d="M9.5 12.5h5" />
    </Svg>
  );
}

export function Sign(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M12 12v9" />
      <rect x="4" y="4" width="16" height="8" rx="1.5" />
      <path d="M8 8h8" />
    </Svg>
  );
}

export function MapPin(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </Svg>
  );
}

export function Leaf(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M4 20c0-8 6-14 16-14 0 10-6 14-14 14" />
      <path d="M4.5 19.5C8 14 12 12 16 11" />
    </Svg>
  );
}

export function Sparkle(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    </Svg>
  );
}

export function Banner(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M5 3h14v13l-7-3-7 3z" />
      <path d="M9 3v8M15 3v8" />
    </Svg>
  );
}
