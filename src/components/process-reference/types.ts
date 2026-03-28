export interface ProcessImage {
  src: string;
  alt: string;
}

export interface ProcessAction {
  href: string;
  label: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  align: "left" | "right";
  layout: "single" | "bordered" | "ultrawide" | "grid";
  meta?: string;
  metaList?: string[];
  images: ProcessImage[];
  action?: ProcessAction;
}
