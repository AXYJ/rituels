// État partagé entre Game (bouton retour du navigateur) et BlocNotes (qui pousse une entrée d'historique)
export const backGuard = {
  blocNotesOpen: false,
  skipPopState: false,
  closeBlocNotes: null as (() => void) | null,
};
