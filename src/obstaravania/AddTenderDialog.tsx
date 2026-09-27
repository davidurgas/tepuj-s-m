// Ručné pridanie zákazky nájdenej inde (ÚVO, EKS, Josephine, e-mail od obstarávateľa…).
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { classify, type Tender } from "./core";

export default function AddTenderDialog({ onAdd }: { onAdd: (t: Tender) => void }) {
  const [open, setOpen] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => String(f.get(k) ?? "").trim();
    const title = s("title");
    if (!title) return;
    const valueNum = Number(s("value").replace(/\s/g, "").replace(",", "."));
    const cls = classify(`${title} ${s("description")}`, []);
    onAdd({
      id: `manual-${Date.now().toString(36)}`,
      source: "manual",
      title,
      buyer: s("buyer"),
      city: s("city") || undefined,
      description: s("description") || undefined,
      publishedAt: new Date().toISOString().slice(0, 10),
      deadline: s("deadline") ? s("deadline") + (s("time") ? `T${s("time")}` : "") : undefined,
      noticeType: "",
      stage: "vyzva",
      cpv: [],
      value: s("value") && !isNaN(valueNum) ? valueNum : undefined,
      currency: "EUR",
      url: s("url") || "#",
      relevance: cls.relevance === "ine" ? "tepovanie" : cls.relevance,
      matched: [],
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Plus /> Pridať zákazku ručne
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pridať zákazku</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="title">Názov *</Label>
            <Input id="title" name="title" required placeholder="Tepovanie kobercov v budove školy" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="buyer">Obstarávateľ</Label>
            <Input id="buyer" name="buyer" placeholder="Mesto / škola / nemocnica" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="city">Mesto</Label>
              <Input id="city" name="city" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="value">Hodnota (€ bez DPH)</Label>
              <Input id="value" name="value" inputMode="decimal" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="deadline">Termín ponúk</Label>
              <Input id="deadline" name="deadline" type="date" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="time">Čas</Label>
              <Input id="time" name="time" type="time" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="url">Odkaz na zákazku</Label>
            <Input id="url" name="url" type="url" placeholder="https://www.uvo.gov.sk/…" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Popis</Label>
            <Textarea id="description" name="description" rows={3} />
          </div>
          <Button type="submit" className="w-full">
            Uložiť
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
