// Airtable API Service for Diocese of Tagum

const AIRTABLE_TOKEN = process.env.EXPO_PUBLIC_VIBECODE_AIRTABLE_TOKEN;
const BASE_ID = "appg4acMLnyheaLxe";
const TABLE_ID = "tbly6k8dViZFaB09K";

interface AirtableRecord {
  id: string;
  fields: {
    [key: string]: any;
  };
  createdTime: string;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

/**
 * Fetch all parishes from Airtable
 * @returns Array of parish records
 */
export async function fetchParishes(): Promise<AirtableRecord[]> {
  if (!AIRTABLE_TOKEN) {
    console.error("Airtable Personal Access Token is not configured");
    throw new Error("Airtable token is missing. Please add it in the ENV tab.");
  }

  try {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Airtable API error: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const data: AirtableResponse = await response.json();
    return data.records;
  } catch (error) {
    console.error("Error fetching parishes from Airtable:", error);
    throw error;
  }
}

/**
 * Fetch all records from any table with pagination support
 * @param tableId - The Airtable table ID
 * @returns Array of all records from the table
 */
export async function fetchAllRecords(tableId: string): Promise<AirtableRecord[]> {
  if (!AIRTABLE_TOKEN) {
    console.error("Airtable Personal Access Token is not configured");
    throw new Error("Airtable token is missing. Please add it in the ENV tab.");
  }

  let allRecords: AirtableRecord[] = [];
  let offset: string | undefined;

  try {
    do {
      const url = offset
        ? `https://api.airtable.com/v0/${BASE_ID}/${tableId}?offset=${offset}`
        : `https://api.airtable.com/v0/${BASE_ID}/${tableId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Airtable API error: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const data: AirtableResponse = await response.json();
      allRecords = [...allRecords, ...data.records];
      offset = data.offset;
    } while (offset);

    return allRecords;
  } catch (error) {
    console.error("Error fetching records from Airtable:", error);
    throw error;
  }
}

export type { AirtableRecord, AirtableResponse };
