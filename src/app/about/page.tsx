import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "À propos — Yahya Haroun" };

export default async function AboutPage() {
  const supabase = createClient();
  const { data: profile } = await supabase.from("profiles").select("*").limit(1).single();

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-bold text-foreground">À propos</h1>

      <div className="mt-10 space-y-8 text-foreground/70">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Parcours</h2>
          <p className="mt-2 leading-relaxed">
            {profile?.bio ??
              "Mon parcours mêle une longue expérience de terrain et une reconversion assumée vers le développement logiciel. Cette double perspective m'aide à concevoir des outils numériques réellement adaptés aux contraintes concrètes des utilisateurs, plutôt que des solutions théoriques déconnectées du terrain."}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">Vision</h2>
          <p className="mt-2 leading-relaxed">
            {profile?.vision ??
              "Je crois en des solutions numériques sécurisées, pensées pour les réalités africaines : connectivité intermittente, besoin de simplicité, et exigence de fiabilité. Chaque produit que je conçois doit fonctionner d'abord sur le terrain, pas seulement dans un environnement de démonstration."}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">Philosophie</h2>
          <p className="mt-2 leading-relaxed">
            Un bon logiciel n'est pas celui qui impressionne dans une démo, mais celui qu'on
            utilise encore un an après sans y penser. Je privilégie la robustesse, la sécurité
            et la clarté sur l'accumulation de fonctionnalités.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">Objectifs professionnels</h2>
          <p className="mt-2 leading-relaxed">
            Approfondir mon expertise en cybersécurité pour concevoir des architectures
            sécurisées de bout en bout, et accompagner des entreprises dans leur transformation
            numérique avec des solutions taillées pour leur contexte réel.
          </p>
        </div>
      </div>
    </section>
  );
}
