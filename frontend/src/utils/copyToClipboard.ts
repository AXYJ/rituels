export default function copyToClipboard(
  text: string,
  setCopySuccess: (success: boolean) => void
) {
  if (typeof navigator === "undefined" || !navigator.clipboard) return;
  navigator.clipboard
    .writeText(text)
    .then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    })
    .catch((err) => {
      console.error("Erreur lors de la copie du code :", err);
    });
}
