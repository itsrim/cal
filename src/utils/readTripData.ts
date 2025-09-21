import Papa from "papaparse";

// URL Google Sheets avec un chiffrement simple par décalage
const GOOGLE_SHEETS_URL_ENCODED =
  "iuuqt;00epdt/hpphmf/dpn0tqsfbetiffut0e02MzzNpPIfGS6M2D4hSgWG7D4shNuQv1OIievOE9:QNfN0feju@vtq>tibsjoh";
const DEFAULT_CSV_PATH = "/cal/trip-data.csv";

// Fonction de déchiffrement simple (décalage de caractères)
const simpleDecrypt = (encoded: string): string => {
  return encoded
    .split("")
    .map((char) => String.fromCharCode(char.charCodeAt(0) - 1))
    .join("");
};

export const readTripData = async () => {
  try {
    // Déchiffrement de l'URL et transformation pour l'export CSV
    const GOOGLE_SHEETS_URL = simpleDecrypt(GOOGLE_SHEETS_URL_ENCODED);
    const SHEETS_EXPORT_URL = `${GOOGLE_SHEETS_URL.replace(
      "/edit?usp=sharing",
      ""
    )}/export?format=csv`;

    // Tentative de lecture depuis Google Sheets avec options CORS
    const response = await fetch(SHEETS_EXPORT_URL, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "text/csv, application/json",
      },
    });

    if (response.ok) {
      const csvData = await response.text();
      return new Promise((resolve, reject) => {
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            resolve(results.data);
          },
          error: (error: any) => {
            console.error("Erreur de parsing:", error);
            reject(error);
          },
        });
      });
    } else {
      console.error(
        "Réponse non valide:",
        response.status,
        response.statusText
      );
      throw new Error(`Réponse Google Sheets non valide: ${response.status}`);
    }
  } catch (error) {
    console.error("Erreur détaillée lors de la lecture Google Sheets:", error);
    console.log("Tentative de lecture du CSV local...");

    // Fallback vers le fichier CSV local
    try {
      const response = await fetch(DEFAULT_CSV_PATH);
      const csvData = await response.text();
      return new Promise((resolve, reject) => {
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => resolve(results.data),
          error: (error: any) => reject(error),
        });
      });
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier CSV:", error);
      throw error;
    }
  }
};
