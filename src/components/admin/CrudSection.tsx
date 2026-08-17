import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MediaInput } from "./MediaInput";
import type { AdminField } from "./fieldTypes";

type Row = Record<string, unknown>;

interface Props {
  table: string;
  title: string;
  fields: AdminField[];
  orderBy?: { column: string; ascending?: boolean };
  primaryField: string;
  imageField?: string;
  singleRow?: boolean;
}

// The admin panel is client-only and every write is enforced by admin RLS policies.
const db = () => supabase as unknown as {
  from: (table: string) => any;
};

export function CrudSection({
  table,
  title,
  fields,
  orderBy,
  primaryField,
  imageField,
  singleRow,
}: Props) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Row>({});

  const queryKey = ["admin", table];

  const { data: rows = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      let query = db().from(table).select("*");
      if (orderBy) query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const save = useMutation({
    mutationFn: async (values: Row) => {
      const payload: Row = {};
      for (const field of fields) {
        payload[field.name] = values[field.name] ?? null;
      }
      if (values['id']) {
        const { error } = await db().from(table).update(payload).eq("id", values['id']);
        if (error) throw error;
      } else {
        const { error } = await db().from(table).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("सहेज लिया गया");
      setOpen(false);
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db().from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("हटा दिया गया");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const openNew = () => {
    const initial: Row = {};
    for (const field of fields) {
      initial[field.name] = field.type === "boolean" ? true : field.type === "number" ? 0 : "";
    }
    setDraft(initial);
    setOpen(true);
  };

  const openEdit = (row: Row) => {
    setDraft({ ...row });
    setOpen(true);
  };

  const setValue = (name: string, value: unknown) =>
    setDraft((prev) => ({ ...prev, [name]: value }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-primary">{title}</h2>
        {(!singleRow || rows.length === 0) && (
          <Button onClick={openNew} className="gap-2">
            <Plus className="h-4 w-4" /> नया जोड़ें
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          अभी कोई प्रविष्टि नहीं है।
        </p>
      ) : (
        <div className="grid gap-3">
          {rows.map((row) => (
            <div
              key={String(row['id'])}
              className="flex items-center gap-4 rounded-2xl border border-primary/10 bg-card p-4 shadow-sm"
            >
              {imageField && row[imageField] ? (
                <img
                  src={String(row[imageField])}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                />
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">
                  {String(row[primaryField] ?? "—")}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {"is_active" in row ? (row['is_active'] ? "सक्रिय" : "निष्क्रिय") : ""}
                </p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => openEdit(row)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  if (confirm("क्या आप वाकई हटाना चाहते हैं?")) remove.mutate(String(row['id']));
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            {fields.map((field) => {
              const value = draft[field.name];
              return (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-semibold">{field.label}</label>
                  {field.type === "textarea" && (
                    <Textarea
                      value={String(value ?? "")}
                      onChange={(e) => setValue(field.name, e.target.value)}
                      className="min-h-[120px]"
                      placeholder={field.placeholder ?? ""}
                    />
                  )}
                  {(field.type === "text" || field.type === "date" || field.type === "number") && (
                    <Input
                      type={field.type === "text" ? "text" : field.type}
                      value={String(value ?? "")}
                      onChange={(e) =>
                        setValue(
                          field.name,
                          field.type === "number" ? Number(e.target.value) : e.target.value,
                        )
                      }
                      placeholder={field.placeholder ?? ""}
                    />
                  )}
                  {field.type === "boolean" && (
                    <div>
                      <Switch
                        checked={Boolean(value)}
                        onCheckedChange={(checked) => setValue(field.name, checked)}
                      />
                    </div>
                  )}
                  {field.type === "select" && (
                    <Select
                      value={String(value ?? "")}
                      onValueChange={(next) => setValue(field.name, next)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="चुनें" />
                      </SelectTrigger>
                      <SelectContent>
                        {(field.options ?? []).map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {(field.type === "image" || field.type === "video") && (
                    <MediaInput
                      kind={field.type}
                      value={String(value ?? "")}
                      onChange={(url) => setValue(field.name, url)}
                      {...(field.folder ? { folder: field.folder } : {})}
                      {...(field.maxDuration ? { maxDuration: field.maxDuration } : {})}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              रद्द करें
            </Button>
            <Button onClick={() => save.mutate(draft)} disabled={save.isPending}>
              {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              सहेजें
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
