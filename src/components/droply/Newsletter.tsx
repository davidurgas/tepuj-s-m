import { useState } from "react";
import { Gift, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import Bubbles from "./Bubbles";
import Reveal from "./Reveal";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Zadaj platný e-mail, prosím.");
      return;
    }
    setDone(true);
    toast.success("Hotovo! Tvoj zľavový kód je DROPLY10 🎉");
  };

  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div className="container-tight">
        <Reveal className="relative overflow-hidden rounded-3xl bg-hero-gradient p-8 text-white shadow-hover sm:p-14">
          <Bubbles count={12} />
          <div className="relative mx-auto max-w-xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
              <Gift className="h-4 w-4 text-eco" />
              Darček na privítanie
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
              Získaj <span className="bg-gradient-to-r from-accent to-eco bg-clip-text text-transparent">−10 %</span> na prvú objednávku
            </h2>
            <p className="mt-3 text-white/75">
              Nechaj nám e-mail a pošleme ti zľavový kód plus eko tipy do domácnosti. Bez spamu, kedykoľvek sa odhlásiš.
            </p>

            {done ? (
              <div className="mx-auto mt-7 flex max-w-sm items-center justify-center gap-3 rounded-2xl bg-white/15 px-6 py-4 backdrop-blur">
                <Check className="h-5 w-5 text-eco" />
                <span className="text-sm">
                  Tvoj kód: <strong className="font-display text-lg tracking-wider text-white">DROPLY10</strong>
                </span>
              </div>
            ) : (
              <form onSubmit={submit} className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tvoj@email.sk"
                  className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-white placeholder:text-white/50 outline-none backdrop-blur focus:border-accent"
                />
                <button
                  type="submit"
                  className="btn-sheen inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-water-gradient px-6 py-3.5 font-semibold text-white shadow-glow transition-transform hover:scale-105"
                >
                  Chcem zľavu
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
            <p className="mt-3 text-xs text-white/50">Už viac ako 10 000 domácností odoberá naše tipy.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
