// Google Sheets API Service for Diocese of Tagum

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_VIBECODE_GOOGLE_API_KEY;

// Extract spreadsheet ID from URL
// https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit...
const SPREADSHEET_ID = "13GUde5p78ZPFzGS2_OAJNahAgwCcjHwb52o7EtP3pm0";

interface GoogleSheetsResponse {
  range: string;
  majorDimension: string;
  values: string[][];
}

export interface ParishDetails {
  name: string;
  vicariate: string;
  parishPriest: string;
  location: string;
  contact: string;
  email: string;
  history: string;
  fiestaDate: string;
}

export interface SchoolDetails {
  name: string;
  location: string;
  contact: string;
  email: string;
  history: string;
  programs: string;
}

export interface MinistryDetails {
  name: string;
  coordinator: string;
  description: string;
}

export interface CorporationDetails {
  name: string;
  address: string;
  contact: string;
  email: string;
  description: string;
}

export interface CongregationDetails {
  name: string;
  address: string;
  contact: string;
  email: string;
  description: string;
}

export interface DclaimDetails {
  name: string;
  description: string;
}

export interface BECDetails {
  name: string;
  parish: string;
  location: string;
  president: string;
  contact: string;
  history: string;
  fiestaDate: string;
}

export interface SponsorDetails {
  imageUrl: string;
}

export interface VideoDetails {
  videoUrl: string;
}

export interface PriestDetails {
  name: string;
  title: string;
  assignment: string;
  role: string;
  category: string; // To help with grouping (Bishop, Diocesan Priest, Extern Priest, etc.)
  location: string; // Location from Column A
}

/**
 * Fetch data from a specific column in Google Sheets
 * @param column - Column letter (e.g., "B", "C", "D")
 * @param skipHeader - Whether to skip the first row (default: true)
 * @returns Array of values from the column
 */
export async function fetchColumnData(column: string, skipHeader: boolean = true): Promise<string[]> {
  if (!GOOGLE_API_KEY) {
    console.error("Google API key is not configured");
    throw new Error(
      "Google API key is missing. Please add your Google Sheets API key in the ENV tab of the Vibecode app.\n\n" +
      "To get an API key:\n" +
      "1. Go to Google Cloud Console (console.cloud.google.com)\n" +
      "2. Create or select a project\n" +
      "3. Enable Google Sheets API\n" +
      "4. Create credentials (API Key)\n" +
      "5. Add the key as EXPO_PUBLIC_VIBECODE_GOOGLE_API_KEY in ENV tab"
    );
  }

  try {
    // Fetch the specified column
    const range = encodeURIComponent(`${column}:${column}`);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_API_KEY}`;

    console.log(`Fetching column ${column} from Google Sheets`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Sheets API error response:", errorText);

      // Provide helpful error message for common issues
      if (response.status === 400) {
        throw new Error(
          "Invalid Google API key. Please check your API key in the ENV tab.\n\n" +
          "Make sure you have:\n" +
          "1. Created a valid API key in Google Cloud Console\n" +
          "2. Enabled Google Sheets API for your project\n" +
          "3. Added the key as EXPO_PUBLIC_VIBECODE_GOOGLE_API_KEY"
        );
      }

      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }

    const data: GoogleSheetsResponse = await response.json();

    console.log(`Received ${data.values?.length || 0} rows from Google Sheets column ${column}`);

    if (!data.values || data.values.length === 0) {
      console.log("No data found in Google Sheets");
      return [];
    }

    // Extract values from the column
    const values: string[] = [];
    data.values.forEach((row, index) => {
      // Skip first row if skipHeader is true, and skip empty cells
      if ((!skipHeader || index > 0) && row[0] && row[0].trim()) {
        values.push(row[0].trim());
      }
    });

    console.log(`Extracted ${values.length} non-empty values from column ${column}`);
    return values;
  } catch (error) {
    console.error(`Error fetching column ${column} from Google Sheets:`, error);
    throw error;
  }
}

/**
 * Fetch parish names from Google Sheets column B
 * @returns Array of parish names
 */
export async function fetchParishesFromSheet(): Promise<string[]> {
  return fetchColumnData("B", true);
}

/**
 * Fetch vicariate names from Google Sheets column C
 * @returns Array of vicariate names
 */
export async function fetchVicariatesFromSheet(): Promise<string[]> {
  return fetchColumnData("C", true);
}

/**
 * Fetch data from any column in Google Sheets
 * @param range - The range to fetch (e.g., "Sheet1!B:B" or "Sheet1!A1:D10")
 * @returns Array of rows
 */
export async function fetchSheetData(range: string): Promise<string[][]> {
  if (!GOOGLE_API_KEY) {
    console.error("Google API key is not configured");
    throw new Error("Google API key is missing. Please check your ENV settings.");
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_API_KEY}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const data: GoogleSheetsResponse = await response.json();
    return data.values || [];
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error);
    throw error;
  }
}

/**
 * Fetch all parish details from Google Sheets
 * Fetches all columns and logs them to determine the correct mapping
 * @returns Array of parish details
 */
export async function fetchAllParishDetails(): Promise<ParishDetails[]> {
  if (!GOOGLE_API_KEY) {
    throw new Error("Google API key is missing");
  }

  try {
    // Fetch all columns from A to Z to ensure we get all data
    const range = encodeURIComponent("A:Z");
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_API_KEY}`;

    console.log("Fetching all parish details from Google Sheets");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }

    const data: GoogleSheetsResponse = await response.json();

    if (!data.values || data.values.length <= 1) {
      return [];
    }

    // Log the header row to see column names
    console.log("Google Sheets header row:", data.values[0]);
    console.log("Total columns in sheet:", data.values[0]?.length || 0);

    // Log first data row as example
    if (data.values.length > 1) {
      console.log("First data row sample:", data.values[1]);
    }

    // Skip header row and map to ParishDetails
    // Column mapping based on new sheet structure:
    // A=Current (Vicariate), B=Parish, C=Parish Priest, D=Location, E=Contact, F=Email, G=Brief Parish History, H=Fiesta Date
    const parishes: ParishDetails[] = [];
    for (let i = 1; i < data.values.length; i++) {
      const row = data.values[i];

      // Column B (index 1) is the Parish name
      const parishName = row[1]?.trim();

      // Skip rows without a parish name
      if (!parishName) continue;

      parishes.push({
        name: parishName || "N/A", // Column B
        vicariate: row[0]?.trim() || "N/A", // Column A (Current)
        parishPriest: row[2]?.trim() || "N/A", // Column C
        location: row[3]?.trim() || "N/A", // Column D
        contact: row[4]?.trim() || "N/A", // Column E
        email: row[5]?.trim() || "N/A", // Column F
        history: row[6]?.trim() || "N/A", // Column G
        fiestaDate: row[7]?.trim() || "N/A", // Column H
      });
    }

    console.log(`Fetched details for ${parishes.length} parishes`);
    console.log("Sample parish data:", parishes[0]);
    return parishes;
  } catch (error) {
    console.error("Error fetching parish details from Google Sheets:", error);
    throw error;
  }
}

/**
 * Fetch all school details from Google Sheets
 * Fetches from the Schools sheet with columns: School, Location, Contact, Email, School History, Programs
 * @returns Array of school details
 */
export async function fetchAllSchoolDetails(): Promise<SchoolDetails[]> {
  if (!GOOGLE_API_KEY) {
    throw new Error("Google API key is missing");
  }

  try {
    // Fetch from Schools sheet
    const range = encodeURIComponent("Schools!A:F");
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_API_KEY}`;

    console.log("Fetching all school details from Google Sheets");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }

    const data: GoogleSheetsResponse = await response.json();

    if (!data.values || data.values.length <= 1) {
      return [];
    }

    // Log the header row to see column names
    console.log("Schools sheet header row:", data.values[0]);

    // Skip header row and map to SchoolDetails
    // Expected columns: A=School, B=Location, C=Contact, D=Email, E=School History, F=Programs
    const schools: SchoolDetails[] = [];
    for (let i = 1; i < data.values.length; i++) {
      const row = data.values[i];

      // Column A (index 0) is the School name
      const schoolName = row[0]?.trim();

      // Skip rows without a school name
      if (!schoolName) continue;

      schools.push({
        name: schoolName || "N/A",
        location: row[1]?.trim() || "N/A",
        contact: row[2]?.trim() || "N/A",
        email: row[3]?.trim() || "N/A",
        history: row[4]?.trim() || "N/A",
        programs: row[5]?.trim() || "N/A",
      });
    }

    console.log(`Fetched details for ${schools.length} schools`);
    return schools;
  } catch (error) {
    console.error("Error fetching school details from Google Sheets:", error);
    throw error;
  }
}

/**
 * Fetch all ministry details from Google Sheets
 * Fetches from the Ministry sheet with columns: Ministry/Apostolate, Coordinator/Director, Brief Description
 * @returns Array of ministry details
 */
export async function fetchAllMinistryDetails(): Promise<MinistryDetails[]> {
  if (!GOOGLE_API_KEY) {
    throw new Error("Google API key is missing");
  }

  try {
    // Try fetching from "Ministry" sheet first, then try "Ministries" as fallback
    let range = encodeURIComponent("Ministry!A:C");
    let url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_API_KEY}`;

    console.log("Fetching all ministry details from Google Sheets");

    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // If Ministry sheet doesn't exist, try Ministries
    if (!response.ok && response.status === 400) {
      console.log("Ministry sheet not found, trying 'Ministries' sheet");
      range = encodeURIComponent("Ministries!A:C");
      url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_API_KEY}`;

      response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Sheets API error response:", errorText);
      throw new Error(
        `Could not find Ministry or Ministries sheet in your Google Spreadsheet. ` +
        `Please create a sheet named "Ministry" with columns: Ministry/Apostolate, Coordinator/Director, Brief Description`
      );
    }

    const data: GoogleSheetsResponse = await response.json();

    if (!data.values || data.values.length <= 1) {
      console.log("No ministry data found in sheet");
      return [];
    }

    // Log the header row to see column names
    console.log("Ministry sheet header row:", data.values[0]);

    // Skip header row and map to MinistryDetails
    // Expected columns: A=Ministry/Apostolate, B=Coordinator/Director, C=Brief Description
    const ministries: MinistryDetails[] = [];
    for (let i = 1; i < data.values.length; i++) {
      const row = data.values[i];

      // Column A (index 0) is the Ministry name
      const ministryName = row[0]?.trim();

      // Skip rows without a ministry name
      if (!ministryName) continue;

      ministries.push({
        name: ministryName || "N/A",
        coordinator: row[1]?.trim() || "N/A",
        description: row[2]?.trim() || "N/A",
      });
    }

    console.log(`Fetched details for ${ministries.length} ministries`);
    return ministries;
  } catch (error) {
    console.error("Error fetching ministry details from Google Sheets:", error);
    throw error;
  }
}

/**
 * Fetch all corporation details from Google Sheets
 * Fetches from the Corporations sheet with columns: Corporation/Entity, Address, Contact, Email, Description
 * @returns Array of corporation details
 */
export async function fetchAllCorporationDetails(): Promise<CorporationDetails[]> {
  if (!GOOGLE_API_KEY) {
    throw new Error("Google API key is missing");
  }

  try {
    // Fetch from Corporations sheet
    const range = encodeURIComponent("Corporations!A:E");
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_API_KEY}`;

    console.log("Fetching all corporation details from Google Sheets");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }

    const data: GoogleSheetsResponse = await response.json();

    if (!data.values || data.values.length <= 1) {
      return [];
    }

    // Log the header row to see column names
    console.log("Corporations sheet header row:", data.values[0]);

    // Skip header row and map to CorporationDetails
    // Expected columns: A=Corporation/Entity, B=Address, C=Contact, D=Email, E=Description
    const corporations: CorporationDetails[] = [];
    for (let i = 1; i < data.values.length; i++) {
      const row = data.values[i];

      // Column A (index 0) is the Corporation name
      const corporationName = row[0]?.trim();

      // Skip rows without a corporation name
      if (!corporationName) continue;

      corporations.push({
        name: corporationName || "N/A",
        address: row[1]?.trim() || "N/A",
        contact: row[2]?.trim() || "N/A",
        email: row[3]?.trim() || "N/A",
        description: row[4]?.trim() || "N/A",
      });
    }

    console.log(`Fetched details for ${corporations.length} corporations`);
    return corporations;
  } catch (error) {
    console.error("Error fetching corporation details from Google Sheets:", error);
    throw error;
  }
}

/**
 * Fetch all congregation details from Google Sheets
 * Fetches from the Congregations sheet with columns: Congregation/Order, Address, Contact, Email, Brief History/Description
 * @returns Array of congregation details
 */
export async function fetchAllCongregationDetails(): Promise<CongregationDetails[]> {
  if (!GOOGLE_API_KEY) {
    throw new Error("Google API key is missing");
  }

  try {
    // Fetch from Congregations sheet
    const range = encodeURIComponent("Congregations!A:E");
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_API_KEY}`;

    console.log("Fetching all congregation details from Google Sheets");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }

    const data: GoogleSheetsResponse = await response.json();

    if (!data.values || data.values.length <= 1) {
      return [];
    }

    // Log the header row to see column names
    console.log("Congregations sheet header row:", data.values[0]);

    // Skip header row and map to CongregationDetails
    // Expected columns: A=Congregation/Order, B=Address, C=Contact, D=Email, E=Brief History/Description
    const congregations: CongregationDetails[] = [];
    for (let i = 1; i < data.values.length; i++) {
      const row = data.values[i];

      // Column A (index 0) is the Congregation name
      const congregationName = row[0]?.trim();

      // Skip rows without a congregation name
      if (!congregationName) continue;

      congregations.push({
        name: congregationName || "N/A",
        address: row[1]?.trim() || "N/A",
        contact: row[2]?.trim() || "N/A",
        email: row[3]?.trim() || "N/A",
        description: row[4]?.trim() || "N/A",
      });
    }

    console.log(`Fetched details for ${congregations.length} congregations`);
    return congregations;
  } catch (error) {
    console.error("Error fetching congregation details from Google Sheets:", error);
    throw error;
  }
}

/**
 * Fetch all DCLAIM details from Google Sheets
 * Fetches from the DCLAIM sheet with columns: Group/Movement, Description
 * @returns Array of DCLAIM details
 */
export async function fetchAllDclaimDetails(): Promise<DclaimDetails[]> {
  if (!GOOGLE_API_KEY) {
    throw new Error("Google API key is missing");
  }

  try {
    // Fetch from DCLAIM sheet
    const range = encodeURIComponent("DCLAIM!A:B");
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_API_KEY}`;

    console.log("Fetching all DCLAIM details from Google Sheets");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }

    const data: GoogleSheetsResponse = await response.json();

    if (!data.values || data.values.length <= 1) {
      return [];
    }

    // Log the header row to see column names
    console.log("DCLAIM sheet header row:", data.values[0]);

    // Skip header row and map to DclaimDetails
    // Expected columns: A=Group/Movement, B=Description
    const dclaims: DclaimDetails[] = [];
    for (let i = 1; i < data.values.length; i++) {
      const row = data.values[i];

      // Column A (index 0) is the Group/Movement name
      const dclaimName = row[0]?.trim();

      // Skip rows without a group/movement name
      if (!dclaimName) continue;

      dclaims.push({
        name: dclaimName || "N/A",
        description: row[1]?.trim() || "N/A",
      });
    }

    console.log(`Fetched details for ${dclaims.length} DCLAIM groups/movements`);
    return dclaims;
  } catch (error) {
    console.error("Error fetching DCLAIM details from Google Sheets:", error);
    throw error;
  }
}

/**
 * Fetch all BEC details from Google Sheets
 * Fetches from the BEC sheet with columns: Parish, GKK Name, Location, BEC President, Contact, Brief History, Fiesta Date
 * @returns Array of BEC details
 */
export async function fetchAllBECDetails(): Promise<BECDetails[]> {
  if (!GOOGLE_API_KEY) {
    throw new Error("Google API key is missing");
  }

  try {
    // Fetch from BEC sheet
    const range = encodeURIComponent("BEC!A:G");
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_API_KEY}`;

    console.log("Fetching all BEC details from Google Sheets");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }

    const data: GoogleSheetsResponse = await response.json();

    if (!data.values || data.values.length <= 1) {
      return [];
    }

    // Log the header row to see column names
    console.log("BEC sheet header row:", data.values[0]);

    // Skip header row and map to BECDetails
    // Expected columns: A=Parish, B=GKK Name, C=Location, D=BEC President, E=Contact, F=Brief History, G=Fiesta Date
    const becs: BECDetails[] = [];
    for (let i = 1; i < data.values.length; i++) {
      const row = data.values[i];

      // Column B (index 1) is the GKK Name (BEC name)
      const becName = row[1]?.trim();

      // Skip rows without a BEC name
      if (!becName) continue;

      becs.push({
        name: becName || "N/A", // Column B
        parish: row[0]?.trim() || "N/A", // Column A
        location: row[2]?.trim() || "N/A", // Column C
        president: row[3]?.trim() || "N/A", // Column D
        contact: row[4]?.trim() || "N/A", // Column E
        history: row[5]?.trim() || "N/A", // Column F
        fiestaDate: row[6]?.trim() || "N/A", // Column G
      });
    }

    console.log(`Fetched details for ${becs.length} BECs`);
    return becs;
  } catch (error) {
    console.error("Error fetching BEC details from Google Sheets:", error);
    throw error;
  }
}

/**
 * Convert Google Drive sharing link to direct image URL
 * Example: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * Converts to: https://drive.google.com/uc?export=view&id=FILE_ID
 */
function convertGoogleDriveUrl(url: string): string {
  // Check if it's a Google Drive link
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
    console.log(`Converted Google Drive URL: ${url} -> ${directUrl}`);
    return directUrl;
  }
  return url;
}

/**
 * Fetch all sponsor images from Google Sheets (Sponsors sheet, Column A)
 */
export async function fetchAllSponsorImages(): Promise<SponsorDetails[]> {
  try {
    const range = "Sponsors!A:A"; // Column A contains image URLs

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_API_KEY}`;

    console.log("Fetching all sponsor images from Google Sheets");
    console.log("Sponsors URL:", url);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Sponsors API error response:", errorText);
      console.error("Response status:", response.status, response.statusText);
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }

    const data: GoogleSheetsResponse = await response.json();
    console.log("Sponsors API response:", JSON.stringify(data, null, 2));

    if (!data.values || data.values.length === 0) {
      console.log("No data found in Sponsors sheet");
      return [];
    }

    console.log("Sponsors sheet raw data:", data.values);

    const sponsors: SponsorDetails[] = [];

    // Skip header row (row 1), start from row 2 (index 1)
    for (let i = 1; i < data.values.length; i++) {
      const row = data.values[i];
      let imageUrl = row[0]?.trim();

      console.log(`Row ${i + 1}: imageUrl = "${imageUrl}"`);

      // Only add if URL exists, is not empty, and starts with http
      if (imageUrl && imageUrl.length > 0 && imageUrl.startsWith("http")) {
        // Convert Google Drive links to direct image URLs
        imageUrl = convertGoogleDriveUrl(imageUrl);

        sponsors.push({
          imageUrl,
        });
      }
    }

    console.log(`Fetched ${sponsors.length} sponsor images`);
    console.log("Sponsor images:", sponsors);
    return sponsors;
  } catch (error) {
    console.error("Error fetching sponsor images from Google Sheets:", error);
    throw error;
  }
}


/**
 * Fetch all video URLs from Google Sheets (Videos sheet, Column A)
 */
export async function fetchAllVideoUrls(): Promise<VideoDetails[]> {
  try {
    const range = "Videos!A:A"; // Column A contains video URLs

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_API_KEY}`;

    console.log("Fetching all video URLs from Google Sheets");

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Videos API error response:", errorText);
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }

    const data: GoogleSheetsResponse = await response.json();

    if (!data.values || data.values.length === 0) {
      console.log("No data found in Videos sheet");
      return [];
    }

    console.log("Videos sheet raw data:", data.values);

    const videos: VideoDetails[] = [];

    // Skip header row (row 1), start from row 2 (index 1)
    for (let i = 1; i < data.values.length; i++) {
      const row = data.values[i];
      let videoUrl = row[0]?.trim();

      console.log(`Row ${i + 1}: videoUrl = "${videoUrl}"`);

      // Only add if URL exists, is not empty, and starts with http
      // Note: URL conversion for Google Drive is handled in the VideoModal component
      if (videoUrl && videoUrl.length > 0 && videoUrl.startsWith("http")) {
        videos.push({
          videoUrl,
        });
      }
    }

    console.log(`Fetched ${videos.length} video URLs`);
    console.log("Video URLs:", videos);
    return videos;
  } catch (error) {
    console.error("Error fetching video URLs from Google Sheets:", error);
    throw error;
  }
}

/**
 * Fetch all priest details from Google Sheets
 * Fetches from the Priests sheet and intelligently groups them by category
 * Expected columns: A=Name, B=Title, C=Assignment, D=Role
 * @returns Array of priest details with smart categorization
 */
export async function fetchAllPriestDetails(): Promise<PriestDetails[]> {
  if (!GOOGLE_API_KEY) {
    throw new Error("Google API key is missing");
  }

  try {
    // Fetch from Priests sheet
    const range = encodeURIComponent("Priests!A:D");
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_API_KEY}`;

    console.log("Fetching all priest details from Google Sheets");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }

    const data: GoogleSheetsResponse = await response.json();

    if (!data.values || data.values.length <= 1) {
      return [];
    }

    // Log the header row to see column names
    console.log("Priests sheet header row:", data.values[0]);

    const priests: PriestDetails[] = [];
    let currentCategory = "";

    // Skip header row and map to PriestDetails
    // Actual columns: A=Location, B=Parish/Institution, C=Parish Priest, D=Parochial Vicar/Associate (can be multiple)
    for (let i = 1; i < data.values.length; i++) {
      const row = data.values[i];

      // Column A (index 0) is the Location
      const location = row[0]?.trim() || "";
      const parish = row[1]?.trim() || "";
      const parishPriest = row[2]?.trim() || "";
      const associatesText = row[3]?.trim() || "";

      // Check if this row is a category header
      const isCategory = location && !parish && !parishPriest && !associatesText;

      if (isCategory) {
        currentCategory = location;
        console.log(`Found category: ${currentCategory}`);
        continue;
      }

      // Determine the role based on the category
      // For Chaplains section, use "Chaplain" instead of "Parish Priest"
      const isChaplainCategory = currentCategory.toLowerCase().includes("chaplain");
      const isDiocesanSchools = currentCategory.toLowerCase().includes("diocesan school");
      const isQACSFormators = currentCategory.toLowerCase().includes("qacs formator");
      const isPriestsOutside = currentCategory.toLowerCase().includes("priest") && currentCategory.toLowerCase().includes("outside");
      const isRetiredPriests = currentCategory.toLowerCase().includes("retired");

      // For Diocesan Schools, QACS Formators, Priests Outside Diocese, Retired Priests:
      // Column A = Institution, Column B = Role, Column C = Priest
      if (isDiocesanSchools || isQACSFormators || isPriestsOutside || isRetiredPriests) {
        const schoolName = location; // Column A is School name
        const roleFromSheet = parish; // Column B is Role
        const priestName = parishPriest; // Column C is Priest name

        if (priestName) {
          priests.push({
            name: priestName,
            title: "",
            assignment: schoolName || "N/A", // School name as assignment
            role: roleFromSheet || "N/A", // Role from Column B
            category: currentCategory || "Clergy",
            location: "", // No separate location for schools
          });
        }
        continue; // Skip the default processing for this category
      }

      const primaryRole = isChaplainCategory ? "Chaplain" : "Parish Priest";
      const secondaryRole = isChaplainCategory ? "Chaplain" : "Parochial Vicar";

      // Add the Parish Priest / Chaplain (Column C) as first entry
      if (parishPriest) {
        priests.push({
          name: parishPriest, // Column C: Parish Priest / Chaplain name
          title: "", // No separate title column
          assignment: parish || "N/A", // Column B: Parish/Institution
          role: primaryRole, // Use category-appropriate role
          category: currentCategory || "Clergy",
          location: location || "N/A", // Column A: Location
        });
      }

      // Split Column D by line breaks AND commas to handle multiple priests
      if (associatesText) {
        const lines = associatesText.split(/\n|,/).map(line => line.trim()).filter(line => line.length > 0);

        // Parse priests smartly - look for lines that start with titles like "Rev.", "Fr.", "Msgr.", etc.
        const priestPattern = /^(Rev\.|Fr\.|Msgr\.|Deacon|Bishop|Most Rev\.|Very Rev\.)/i;

        // Collect all priest names from Column D
        const priestNames: string[] = [];

        lines.forEach((line) => {
          // Check if this line is a priest name (starts with a title)
          if (priestPattern.test(line)) {
            priestNames.push(line);
          }
        });

        // Add each priest from Column D as separate entry
        priestNames.forEach(priestName => {
          priests.push({
            name: priestName,
            title: "",
            assignment: parish || "N/A",
            role: secondaryRole, // Use category-appropriate role
            category: currentCategory || "Clergy",
            location: location || "N/A",
          });
        });
      }
    }

    console.log(`Fetched details for ${priests.length} priests`);
    console.log("Sample priest data:", priests[0]);
    return priests;
  } catch (error) {
    console.error("Error fetching priest details from Google Sheets:", error);
    throw error;
  }
}

export type { GoogleSheetsResponse };
