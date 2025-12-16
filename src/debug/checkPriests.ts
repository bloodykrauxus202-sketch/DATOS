// Debug script to check Priests sheet data
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_VIBECODE_GOOGLE_API_KEY;
const SPREADSHEET_ID = "13GUde5p78ZPFzGS2_OAJNahAgwCcjHwb52o7EtP3pm0";

export async function debugPriestsSheet() {
  try {
    const range = encodeURIComponent("Priests!A:D");
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_API_KEY}`;

    console.log("=== DEBUGGING PRIESTS SHEET ===");

    const response = await fetch(url);
    const data = await response.json();

    if (!data.values) {
      console.log("No data found in Priests sheet");
      return;
    }

    console.log("Total rows:", data.values.length);
    console.log("Header row:", JSON.stringify(data.values[0]));
    console.log("");

    // Log all rows to understand the structure
    for (let i = 0; i < data.values.length; i++) {
      const row = data.values[i];
      const colA = row[0] || "";
      const colB = row[1] || "";
      const colC = row[2] || "";
      const colD = row[3] || "";

      // Detect category rows (only Column A has data)
      const isCategory = colA && !colB && !colC && !colD;

      if (isCategory) {
        console.log(`\n=== ROW ${i + 1}: CATEGORY === "${colA}"`);
      } else {
        console.log(`ROW ${i + 1}: A="${colA}" | B="${colB}" | C="${colC}" | D="${colD}"`);
      }
    }

    console.log("\n=== END DEBUG ===");
  } catch (error) {
    console.error("Debug error:", error);
  }
}
