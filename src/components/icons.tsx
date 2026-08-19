import type { SVGProps } from "react";

function Icon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
}

export function IconBed(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7" />
      <path d="M3 18v2" />
      <path d="M21 18v2" />
      <path d="M3 13h18" />
      <path d="M7 13V9a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1" />
    </Icon>
  );
}

export function IconUsers(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M15.5 14.2c2.6.4 4.5 2.6 4.5 5.3" />
    </Icon>
  );
}

export function IconWifi(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M2 8.5a15.5 15.5 0 0 1 20 0" />
      <path d="M5.5 12.3a10.7 10.7 0 0 1 13 0" />
      <path d="M9 16a5.6 5.6 0 0 1 6 0" />
      <circle cx="12" cy="19.2" r="1" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function IconKitchen(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M4 3v18" />
      <path d="M8 3v18" />
      <path d="M4 3h4" />
      <path d="M4 9h4" />
      <path d="M14 3v8a3 3 0 0 0 6 0V3" />
      <path d="M17 11v10" />
    </Icon>
  );
}

export function IconMountain(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="m3 19 6-10 4 6 2-3 6 7Z" />
      <circle cx="8" cy="6" r="1.6" />
    </Icon>
  );
}

export function IconParking(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 16V7h3.5a2.75 2.75 0 0 1 0 5.5H9" />
    </Icon>
  );
}

export function IconFireplace(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M8.5 14.5c-1-2 .3-3.6 1-4.5-.2 1.4.6 1.9 1.2 1.3.7-.7.4-2-.2-2.8 1.8.3 3.5 2.2 3.5 4.3a3.5 3.5 0 0 1-7 0c0-.5.1-1 .3-1.3" />
      <path d="M4 21V10a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v11" />
      <path d="M4 21h16" />
    </Icon>
  );
}

export function IconPet(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="5.5" cy="9" r="1.6" />
      <circle cx="9.5" cy="5.5" r="1.6" />
      <circle cx="14.5" cy="5.5" r="1.6" />
      <circle cx="18.5" cy="9" r="1.6" />
      <path d="M12 13c-3.5 0-6 2-6 4.5 0 1.6 1.3 2.5 3 2 1-.3 1.6-.7 3-.7s2 .4 3 .7c1.7.5 3-.4 3-2 0-2.5-2.5-4.5-6-4.5Z" />
    </Icon>
  );
}

export function IconWasher(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 3v2" />
      <path d="M12 3v2" />
      <circle cx="12" cy="13" r="5" />
      <circle cx="12" cy="13" r="2" />
    </Icon>
  );
}

export function IconMapPin(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.4" />
    </Icon>
  );
}

export function IconPhone(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M5 4h3.2l1.3 4.5-2 1.4a12.5 12.5 0 0 0 6.6 6.6l1.4-2 4.5 1.3V19a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-1Z" />
    </Icon>
  );
}

export function IconMail(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </Icon>
  );
}

export function IconCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="m5 12 5 5 9-10" />
    </Icon>
  );
}
