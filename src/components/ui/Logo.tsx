import React from "react";
import Image from "next/image";

const logoredirect = "/";

interface LogoProps {
  size?: number;
}

export default function Logo({ size = 100 }: LogoProps) {
  return (
    <div className="flex">
      <a href={logoredirect} className="-m-1.5 p-1.5">
        <span className="sr-only">Logo Camher</span>
        <Image
          width={size}
          height={size}
          src="/Logo.svg"
          alt="Logo Camher"
          className="rounded-full"
        />
      </a>
    </div>
  );
}
