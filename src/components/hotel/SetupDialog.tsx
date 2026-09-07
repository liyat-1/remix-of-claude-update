import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Field = {
  label: string;
  placeholder?: string;
  options?: string[];
  value?: string;
};

type StepSpec = {
  title: string;
  description: string;
  steps: string[];
  fields: Field[];
  cta: string;
};

const specs: Record<string, StepSpec> = {
  "PMS sync": {
    title: "Set up PMS sync",
    description:
      "Connect the property management system so reservations, folios and room status stay in sync.",
    steps: [
      "Create an integration user in the PMS with read access to reservations.",
      "Paste the endpoint and credentials below.",
      "We run a test pull and enable the hourly sync.",
    ],
    fields: [
      {
        label: "PMS vendor",
        options: ["Opera Cloud", "Mews", "Cloudbeds", "StayNTouch", "RoomKeyPMS", "Other"],
        value: "Opera Cloud",
      },
      { label: "Property / site code", placeholder: "e.g. FLLMB01" },
      { label: "API endpoint", placeholder: "https://pms.example.com/api" },
      { label: "Integration user", placeholder: "integration@hotel.com" },
      { label: "API key or password", placeholder: "••••••••••" },
      { label: "Sync frequency", options: ["Every 15 minutes", "Hourly", "Every 6 hours", "Daily"], value: "Hourly" },
    ],
    cta: "Connect PMS",
  },
  "Booking engine": {
    title: "Set up booking engine",
    description: "Link the booking engine so quotes and confirmations reflect live rates.",
    steps: [
      "Grab the booking engine property URL.",
      "Add the tracking key from your engine dashboard.",
      "We validate a test quote before going live.",
    ],
    fields: [
      { label: "Engine", options: ["Synxis", "Windsurfer", "Travelclick", "Other"], value: "Synxis" },
      { label: "Booking URL", placeholder: "https://book.example.com/hotel" },
      { label: "Tracking key", placeholder: "e.g. BE-49213" },
    ],
    cta: "Connect engine",
  },
  "Proxy number": {
    title: "Set up proxy number",
    description: "Assign a tracked number that forwards to the property's reservation line.",
    steps: [
      "Pick an area code for the new number.",
      "Confirm the forwarding destination.",
      "We provision the number and start recording call stats.",
    ],
    fields: [
      { label: "Area code", placeholder: "954" },
      { label: "Forward to", placeholder: "+1 954 000 0000" },
    ],
    cta: "Provision number",
  },
  "Campaign registry": {
    title: "Set up campaign registry",
    description: "Register the brand and messaging campaign so SMS can be delivered in the US.",
    steps: [
      "Confirm the legal entity and EIN.",
      "Submit the campaign use case for review.",
      "Approval usually lands within 3 business days.",
    ],
    fields: [
      { label: "Legal entity", placeholder: "Hotel at Marina Bay LLC" },
      { label: "EIN", placeholder: "00-0000000" },
      {
        label: "Use case",
        options: ["Customer care", "Marketing", "Mixed", "2FA"],
        value: "Customer care",
      },
    ],
    cta: "Submit registration",
  },
  "Brand logo and colors": {
    title: "Set up brand logo and colors",
    description: "Apply the property's branding to guest-facing pages and messages.",
    steps: [
      "Upload a square logo, at least 512×512.",
      "Set the primary brand color.",
      "Preview and publish.",
    ],
    fields: [
      { label: "Logo URL", placeholder: "https://…/logo.png" },
      { label: "Primary color", placeholder: "#1F4FD8" },
    ],
    cta: "Save branding",
  },
};

function fallbackSpec(step: string): StepSpec {
  return {
    title: `Set up ${step.toLowerCase()}`,
    description: "Provide the details below and we'll finish the configuration.",
    steps: ["Fill in the required details.", "We validate the configuration.", "The step is marked complete."],
    fields: [{ label: step, placeholder: `Enter ${step.toLowerCase()} details` }],
    cta: "Save",
  };
}

export function SetupDialog({
  step,
  onOpenChange,
  onComplete,
}: {
  step: string | null;
  onOpenChange: (open: boolean) => void;
  onComplete?: (step: string) => void;
}) {
  const [saving, setSaving] = useState(false);
  const spec = step ? specs[step] ?? fallbackSpec(step) : null;

  useEffect(() => {
    if (step) setSaving(false);
  }, [step]);

  return (
    <Dialog open={!!step} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {spec ? (
          <>
            <DialogHeader>
              <DialogTitle>{spec.title}</DialogTitle>
              <DialogDescription>{spec.description}</DialogDescription>
            </DialogHeader>

            <ol className="space-y-2 rounded-xl bg-muted/50 p-3">
              {spec.steps.map((s, i) => (
                <li key={s} className="flex gap-2.5 text-[12.5px] leading-snug text-muted-foreground">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-background text-[11px] font-semibold text-foreground">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>

            <div className="grid gap-3 sm:grid-cols-2">
              {spec.fields.map((f) => (
                <div key={f.label} className="space-y-1.5">
                  <Label className="text-[12px] font-medium text-muted-foreground">{f.label}</Label>
                  {f.options ? (
                    <Select defaultValue={f.value ?? f.options[0] ?? ""}>
                      <SelectTrigger className="h-9 text-[13px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {f.options.map((o) => (
                          <SelectItem key={o} value={o}>
                            {o}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input className="h-9 text-[13px]" placeholder={f.placeholder} defaultValue={f.value ?? ""} />
                  )}
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                disabled={saving}
                onClick={() => {
                  setSaving(true);
                  setTimeout(() => {
                    setSaving(false);
                    onComplete?.(step!);
                    onOpenChange(false);
                    toast.success(`${step} configured`, {
                      description: "The onboarding step is now marked complete.",
                    });
                  }, 900);
                }}
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                {saving ? "Saving…" : spec.cta}
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
