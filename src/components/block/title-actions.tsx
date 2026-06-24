import { ReactNode } from "react";

interface Props {
  title: ReactNode;
  description: string;
  actions?: ReactNode;
}

export default function TitleActions({ title, description, actions }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">{actions && actions}</div>
    </div>
  );
}
