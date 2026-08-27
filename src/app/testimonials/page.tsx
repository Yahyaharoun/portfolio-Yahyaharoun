import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/types";

export const metadata = { title: "Témoignages — Yahya Haroun" };

export default async function TestimonialsPage() {
  const supabase = createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-3xl font-bold text-foreground">Témoignages</h1>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {(testimonials as Testimonial[] | null)?.map((t) => {
          const Wrapper = t.external_url ? "a" : "div";
          return (
            <Wrapper
              key={t.id}
              {...(t.external_url ? { href: t.external_url, target: "_blank", rel: "noreferrer" } : {})}
              className="block rounded-2xl border border-white/10 bg-muted p-6 transition-colors hover:border-accent/50"
            >
              <p className="text-sm leading-relaxed text-foreground/70">&ldquo;{t.content}&rdquo;</p>
              <p className="mt-4 text-sm font-medium text-foreground">{t.author_name}</p>
              <p className="text-xs text-foreground/50">
                {[t.author_role, t.company].filter(Boolean).join(" — ")}
              </p>
            </Wrapper>
          );
        })}
        {(!testimonials || testimonials.length === 0) && (
          <p className="text-foreground/50">Aucun témoignage publié pour le moment.</p>
        )}
      </div>
    </section>
  );
}
