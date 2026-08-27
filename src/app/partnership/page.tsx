import PartnershipForm from "@/components/PartnershipForm";

export const metadata = { title: "Partenariat — Yahya Haroun" };

export default function PartnershipPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl font-bold text-foreground">Proposer un partenariat</h1>
      <p className="mt-3 text-foreground/60">
        Décrivez votre projet, je reviens vers vous sous 48h ouvrées.
      </p>
      <div className="mt-10">
        <PartnershipForm />
      </div>
    </section>
  );
}
