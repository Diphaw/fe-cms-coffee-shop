import { type LucideIcon, InboxIcon } from "lucide-react";

type Props = {
  /** Lucide icon to display. Falls back to InboxIcon if not provided */
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  /** Optional primary CTA button */
  action?: { label: string; onClick: () => void };
};

/**
 * Reusable empty-state placeholder for lists and tables with no data.
 *
 * @example
 * <EmptyState
 *   icon={Coffee}
 *   title="Belum ada menu"
 *   subtitle="Tambahkan menu pertama Anda."
 *   action={{ label: "Tambah Menu", onClick: openDialog }}
 * />
 */
export function EmptyState({ icon: Icon = InboxIcon, title, subtitle, action }: Props) {
  return (
    <div className="flex h-[550px] w-full flex-col items-center justify-center rounded-xl bg-card p-4 shadow border border-border">
      <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-border border-dashed gap-4 p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-accent/40 flex items-center justify-center text-muted-foreground">
          <Icon className="w-6 h-6 stroke-[1.75]" />
        </div>
        <div className="space-y-1.5">
          <p className="text-foreground text-sm font-semibold">{title}</p>
          {subtitle && (
            <p className="text-muted-foreground text-xs max-w-[300px] leading-relaxed mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="mt-1 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
