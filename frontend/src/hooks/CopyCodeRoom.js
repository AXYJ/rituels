export default function CopyCodeRoom({ roomCode, setCopySuccess }) {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    navigator.clipboard.writeText(roomCode)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((err) => {
        console.error("Erreur lors de la copie du code :", err);
      });
  }
}
