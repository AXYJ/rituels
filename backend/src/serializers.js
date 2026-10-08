// Tout ce qui part vers un client passe par ici : chaque joueur ne reçoit que ce qu'il a le droit de voir.
// - les règles (valeurs des symboles, effets des couleurs) sont secrètes jusqu'à la fin de la partie
// - les cartes des autres joueurs et leur sessionId ne sont jamais envoyés

const hideValues = (record) =>
  Object.fromEntries(Object.keys(record).map((key) => [key, null]));

/** Règles sans leurs valeurs : le client n'a besoin que des noms des symboles et des couleurs */
export function maskRules(rules) {
  return {
    symbolRules: hideValues(rules.symbolRules),
    colorRules: hideValues(rules.colorRules),
  };
}

/** Carte vue par un autre joueur : seul l'id reste (clé d'animation côté client) */
export function hideCard(card) {
  return { id: card.id, symbol: "", color: "" };
}

/** Joueur tel que le voit `viewerId` : tout pour lui-même, rien de secret pour les autres */
function publicPlayer(player, viewerId) {
  if (player.id === viewerId) return player;
  // eslint-disable-next-line no-unused-vars
  const { sessionId, ...rest } = player;
  return { ...rest, deck: { cards: player.deck.cards?.map(hideCard) ?? null } };
}

export function publicPlayers(players, viewerId) {
  return players.map((player) => publicPlayer(player, viewerId));
}

/** Historique sans les effets de couleur appliqués (secrets jusqu'à la fin) */
export function publicHistory(history) {
  return history.map(({ effectiveEffect, ...item }) => item);
}

/** Règles à envoyer : complètes seulement quand la partie est terminée */
export function rulesFor(room) {
  return room.isGameOver ? room.rules : maskRules(room.rules);
}

/** Envoie un event à chaque joueur connecté de la salle, avec un contenu adapté à chacun */
export function emitToRoom(io, room, event, build) {
  for (const player of room.players) {
    if (!player.leavedPlayer) io.to(player.id).emit(event, ...build(player.id));
  }
}

export function emitRoomUpdated(io, room, { withOrder = false } = {}) {
  emitToRoom(io, room, "room_updated", (viewerId) => [
    {
      players: publicPlayers(room.players, viewerId),
      ...(withOrder && { playerOrder: room.playerOrder }),
    },
  ]);
}
