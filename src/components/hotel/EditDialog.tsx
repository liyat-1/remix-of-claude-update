import { useEffect, useState, type ComponentType } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Star, Trash2, ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { StatusSelector } from "@/components/hotel/primitives";
import type { Health } from "@/lib/hotel-data";
import { brandFor } from "@/lib/brands";

function BrandMark({ name, size = 20 }: { name: string; size?: number }) {
  const b = brandFor(name);
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-[5px] text-[9px] font-bold tracking-tight"
      style={{ width: size, height: size, background: b.bg, color: b.fg }}
    >
      {b.mark}
    </span>
  );
}

export type EditField = {
  label: string;
  value: string;
  hint?: string;
  type?: "text" | "select" | "status" | "brand";
  inputType?: "text" | "date" | "tel" | "email" | "url" | "number";
  placeholder?: string;
  options?: string[];
  statusOptions?: { label: string; tone: Health }[];
  group?: string;
  full?: boolean;
};


export type GalleryImage = { id: string; src: string; label: string };

export type EditGallery = {
  images: GalleryImage[];
  coverId: string;
  onDelete: (id: string) => void;
  onCover: (id: string) => void;
  onAdd?: () => void;
};

export type EditGroup = {
  title: string;
  hint?: string;
  icon?: ComponentType<{ className?: string }>;
};

export type EditTarget = {
  title: string;
  fields: EditField[];
  groups?: EditGroup[];
  gallery?: EditGallery;
  onSave?: (values: Record<string, string>) => void;
} | null;

export function EditDialog({
  target,
  onOpenChange,
}: {
  target: EditTarget;
  onOpenChange: (open: boolean) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!target) return;
    setSaving(false);
    setValues(Object.fromEntries(target.fields.map((f) => [f.label, f.value])));
  }, [target]);

  const dirty =
    !!target && target.fields.some((f) => (values[f.label] ?? f.value) !== f.value);

  const save = () => {
    if (!target || saving) return;
    setSaving(true);
    window.setTimeout(() => {
      target.onSave?.(values);
      toast.success("Changes saved", { description: `${target.title} updated` });
      setSaving(false);
      onOpenChange(false);
    }, 450);
  };

  const gallery = target?.gallery;
  const fields = target?.fields ?? [];
  const groups: EditGroup[] =
    target?.groups ??
    (fields.some((f) => f.group)
      ? [...new Set(fields.map((f) => f.group ?? "Details"))].map((title) => ({ title }))
      : []);

  const fieldClass =
    "w-full bg-surface shadow-none border-input focus-visible:ring-2 focus-visible:ring-primary/30 focus:ring-2 focus:ring-primary/30";

  const renderField = (f: EditField) => {
    const current = values[f.label] ?? f.value;
    const selectPlaceholder = f.placeholder ?? `Select ${f.label.toLowerCase()}`;
    return (
      <div key={f.label} className={cn("space-y-1.5", f.full && "sm:col-span-2")}>
        <Label htmlFor={f.label} className="text-[11.5px] font-medium text-muted-foreground">
          {f.label}
        </Label>
        {f.type === "status" ? (
          <StatusSelector
            options={f.statusOptions ?? []}
            value={current}
            onChange={(v) => setValues((s) => ({ ...s, [f.label]: v }))}
          />
        ) : f.type === "brand" || f.type === "select" ? (
          <Select
            value={current}
            onValueChange={(v) => setValues((s) => ({ ...s, [f.label]: v }))}
          >
            <SelectTrigger id={f.label} className={fieldClass}>
              <SelectValue placeholder={selectPlaceholder}>
                {current ? (
                  <span className="flex items-center gap-2">
                    {f.type === "brand" ? <BrandMark name={current} /> : null}
                    <span className="truncate">{current}</span>
                  </span>
                ) : null}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {(f.options ?? []).map((o) => (
                <SelectItem key={o} value={o}>
                  <span className="flex items-center gap-2">
                    {f.type === "brand" ? <BrandMark name={o} /> : null}
                    {o}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            id={f.label}
            type={f.inputType ?? "text"}
            inputMode={f.inputType === "number" ? "numeric" : undefined}
            placeholder={f.placeholder ?? `Enter ${f.label.toLowerCase()}`}
            className={fieldClass}
            value={values[f.label] ?? ""}
            onChange={(e) => setValues((v) => ({ ...v, [f.label]: e.target.value }))}
          />
        )}
        {f.hint ? <p className="text-[11.5px] text-muted-foreground">{f.hint}</p> : null}
      </div>
    );
  };


  return (
    <Dialog open={!!target} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex max-h-[88vh] flex-col gap-0 overflow-hidden p-0 shadow-lg",
          gallery || groups.length ? "sm:max-w-3xl" : "sm:max-w-lg",
        )}
      >
        <DialogHeader className="border-b border-border px-6 py-5 text-left">
          <DialogTitle className="text-[17px] capitalize">Edit {target?.title}</DialogTitle>
          <DialogDescription>
            Changes apply to this hotel record as soon as you save.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <div className="min-h-0 flex-1 overflow-y-auto bg-background/40 px-6 py-5">
            {groups.length ? (
              <div className="space-y-4">
                {groups.map((g) => {
                  const groupFields = fields.filter((f) => (f.group ?? "Details") === g.title);
                  if (!groupFields.length) return null;
                  const Icon = g.icon;
                  return (
                    <section
                      key={g.title}
                      className="rounded-2xl border border-border/70 bg-surface-muted/70 p-4"
                    >
                      <div className="mb-3 flex items-center gap-2.5">
                        {Icon ? (
                          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="size-3.5" />
                          </span>
                        ) : null}
                        <span className="min-w-0">
                          <span className="block text-[12.5px] font-semibold text-foreground">
                            {g.title}
                          </span>
                          {g.hint ? (
                            <span className="block text-[11px] text-muted-foreground">{g.hint}</span>
                          ) : null}
                        </span>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {groupFields.map(renderField)}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <div className={cn("grid gap-4", gallery ? "sm:grid-cols-2" : "grid-cols-1")}>
                {fields.map(renderField)}
              </div>
            )}

            {gallery ? (
              <div className="mt-4 rounded-2xl border border-border/70 bg-surface-muted/70 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[12.5px] font-semibold text-foreground">
                      Property photos
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {gallery.images.length} photo{gallery.images.length === 1 ? "" : "s"} · pick a
                      cover or remove what you no longer need
                    </p>
                  </div>
                  {gallery.onAdd ? (
                    <Button type="button" variant="outline" size="sm" onClick={gallery.onAdd}>
                      <ImagePlus className="size-4" /> Add photo
                    </Button>
                  ) : null}
                </div>
                {gallery.images.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-[12.5px] text-muted-foreground">
                    No photos left. Add one to show the property.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {gallery.images.map((img) => {
                      const isCover = img.id === gallery.coverId;
                      return (
                        <div
                          key={img.id}
                          className={cn(
                            "group relative overflow-hidden rounded-xl border bg-surface",
                            isCover ? "border-primary ring-2 ring-primary/25" : "border-border",
                          )}
                        >
                          <img
                            src={img.src}
                            alt={img.label}
                            loading="lazy"
                            width={1024}
                            height={768}
                            className="aspect-[4/3] w-full object-cover"
                          />
                          <div className="absolute inset-x-0 top-0 flex justify-end gap-1 p-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                            <button
                              type="button"
                              onClick={() => gallery.onCover(img.id)}
                              aria-label={`Make ${img.label} the cover photo`}
                              className="grid size-7 place-items-center rounded-md bg-surface/90 text-foreground backdrop-blur hover:text-primary"
                            >
                              <Star className={cn("size-3.5", isCover && "fill-primary text-primary")} />
                            </button>
                            <button
                              type="button"
                              onClick={() => gallery.onDelete(img.id)}
                              aria-label={`Delete ${img.label}`}
                              className="grid size-7 place-items-center rounded-md bg-surface/90 text-foreground backdrop-blur hover:text-danger"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between gap-1 px-2 py-1.5">
                            <span className="truncate text-[11px] text-muted-foreground">
                              {img.label}
                            </span>
                            {isCover ? (
                              <span className="shrink-0 text-[10px] font-semibold tracking-wide text-primary uppercase">
                                Cover
                              </span>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border bg-surface px-6 py-4">
            <span className="mr-auto text-[11.5px] text-muted-foreground">
              {dirty ? "Unsaved changes" : "No changes yet"}
            </span>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!dirty || saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              Save changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
