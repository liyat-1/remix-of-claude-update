import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function RegistryDialog({
  open,
  onOpenChange,
  brandId,
  campaignId,
  legalName,
  ein,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandId: string;
  campaignId: string;
  legalName: string;
  ein: string;
}) {
  const rows: { label: string; value: string; mono?: boolean }[] = [
    { label: "Legal entity", value: legalName },
    { label: "EIN", value: ein, mono: true },
    { label: "TCR brand ID", value: brandId, mono: true },
    { label: "TCR campaign ID", value: campaignId, mono: true },
    { label: "Use case", value: "Customer care" },
    { label: "Status", value: "Registered · verified" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Campaign registry</DialogTitle>
          <DialogDescription>
            The Campaign Registry record used for SMS delivery on this property.
          </DialogDescription>
        </DialogHeader>

        <div className="divide-y divide-border/70 rounded-xl border border-border">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-3 px-3 py-2.5">
              <span className="text-[12.5px] text-muted-foreground">{r.label}</span>
              <span className="flex items-center gap-1.5">
                <span className={`text-[13px] text-foreground ${r.mono ? "font-mono" : ""}`}>
                  {r.value}
                </span>
                {r.mono ? (
                  <button
                    type="button"
                    aria-label={`Copy ${r.label}`}
                    onClick={() => {
                      void navigator.clipboard?.writeText(r.value);
                      toast.success(`${r.label} copied`);
                    }}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Copy className="size-3.5" />
                  </button>
                ) : null}
              </span>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={() =>
              window.open("https://www.campaignregistry.com/", "_blank", "noopener")
            }
          >
            Open in registry <ExternalLink className="size-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
