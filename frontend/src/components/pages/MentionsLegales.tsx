import { useGame } from "../../context/GameContext";
import Image from "next/image";

export default function MentionsLegales() {
  const { setView } = useGame();

  return (
    <div className="min-h-screen bg-[#191918] px-4 py-16">
      <div className="mx-auto max-w-[1024px]">
        <button
          onClick={() => setView("home")}
          className="group mb-8 flex cursor-pointer items-center gap-2 text-white transition-colors hover:text-gray-300"
        >
          <Image
            src="/assets/arrow-down.png"
            alt="Retour"
            width={24}
            height={12}
            className="rotate-90 transition-transform group-hover:-translate-x-1"
          />
          <span>Retour à l'accueil</span>
        </button>

        <section className="flex flex-col gap-8">
          <div className="mb-16 flex flex-col items-center justify-center gap-8 text-center">
            <h1 className="text-6xl font-bold text-white">Mentions Légales</h1>
            <p className="text-xl text-gray-400">
              En cours de développement ...
            </p>
          </div>

          <div className="grid gap-16">
            <section className="flex flex-col gap-4">
              <h2 className="border-b border-gray-700 pb-2 text-3xl font-bold text-white">
                Article 1: Responsabilités
              </h2>
              <p className="text-lg text-white">
                "Rituels" décline toute responsabilité en cas de besoin
                irrépressible de picorer des graines au sol ou de hocher la tête
                de manière saccadée. Dans ce cas de figure, veuillez consulter
                un vétérinaire.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="border-b border-gray-700 pb-2 text-3xl font-bold text-white">
                Article 2 : Déconseillé aux profils suivants
              </h2>
              <p className="text-lg text-white">
                L'accès au protocole Rituels est fortement déconseillé aux
                catégories de sujets suivantes :
              </p>
              <ul className="list-inside list-[decimal-leading-zero] space-y-2 text-lg text-white">
                <li className="text-2xl">
                  Les Déterministes Rigides : Les personnes croyant que "1 + 1
                  font toujours 2". Ici, 1 + 1 peut faire -2 si la couleur est
                  d'humeur taquine.
                </li>
                <li className="text-2xl">
                  Les Ornithophobes : Par respect pour l'inspiration de
                  l'expérience, bien qu'aucun pigeon n'ait été maltraité
                  (physiquement) durant le développement.
                </li>
                <li className="text-2xl">
                  Les daltoniens et les dyslexiques : La perception des couleurs
                  et des symboles peut en être altérée.
                </li>
                <li className="text-2xl">
                  Les cartomenciens du dimanche : Toute tentative de lire dans
                  les cartes se soldera par un échec. Le système est purement
                  mathématique, même s'il ne vous aime pas.
                </li>
              </ul>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="border-b border-gray-700 pb-2 text-3xl font-bold text-white">
                Article 3 : Propriété Intellectuelle des Échecs
              </h2>
              <p className="text-lg text-white">
                Toute stratégie perdante développée durant le test devient la
                propriété exclusive du Laboratoire. Nous nous réservons le droit
                de rire de vos hypothèses erronées enregistrées dans votre
                bloc-notes lors de nos prochaines réunions de département.
              </p>
              <p className="text-lg text-white">
                Le Laboratoire se réserve le droit d'utiliser vos échecs comme
                exemples pédagogiques pour les sujets suivants.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="border-b border-gray-700 pb-2 text-3xl font-bold text-white">
                Article 4 : Litiges et Plaintes
              </h2>
              <p className="text-lg text-white">
                En cas de désaccord avec le système, c'est le système qui a
                raison. Toute plainte doit être formulée en picorant trois fois
                le sol et en inclinant la tête de manière saccadée.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="border-b border-gray-700 pb-2 text-3xl font-bold text-white">
                Article 5 : Conditions d'Arrêt
              </h2>
              <p className="text-lg text-white">
                Aucune condition d'arrêt n'est prévue pour le moment.
              </p>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
