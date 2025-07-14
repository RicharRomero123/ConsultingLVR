"use client";
import React, { SVGProps, useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/lib/utils";

export const StickyBanner = ({
  className,
  children,
  hideOnScroll = false,
  storageKey = "sticky_banner_closed", // clave que se usará en localStorage
}: {
  className?: string;
  children: React.ReactNode;
  hideOnScroll?: boolean;
  storageKey?: string;
}) => {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  // Mostrar solo si no fue cerrado antes
  useEffect(() => {
    const closed = localStorage.getItem(storageKey);
    if (!closed) {
      setOpen(true);
    }
  }, [storageKey]);

  // Ocultar en scroll si está activado
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (hideOnScroll && latest > 40) {
      setOpen(false);
    } else if (hideOnScroll && latest <= 40 && !localStorage.getItem(storageKey)) {
      setOpen(true);
    }
  });

  // Cerrar y guardar en localStorage
  const handleClose = () => {
    setOpen(false);
    localStorage.setItem(storageKey, "true");
  };

  if (!open) return null;

  return (
    <motion.div
      className={cn(
        "fixed inset-x-0 top-0 z-[9999] flex min-h-14 w-full items-center justify-center px-4 py-1",
        className
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: open ? 0 : -100, opacity: open ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
        onClick={handleClose}
      >
        <CloseIcon className="h-5 w-5 text-white" />
      </motion.button>
    </motion.div>
  );
};

const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </svg>
);
