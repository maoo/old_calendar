import { calendar_v3, google } from 'googleapis';
import fs from 'fs';

const dotenv = require('dotenv');
dotenv.config();

const PRIVATE_KEY_ID = process.env.PRIVATE_KEY_ID;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Replace with the path to your service account JSON file
const SERVICE_ACCOUNT_OBJECT = {
  type: "service_account",
  project_id: "calendar-393913",
  private_key_id: PRIVATE_KEY_ID,
  private_key: PRIVATE_KEY,
  client_email: "finos-calendar@calendar-393913.iam.gserviceaccount.com",
  client_id: "104234361585971910357",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/finos-calendar%40calendar-393913.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

const SERVICE_ACCOUNT_FILE = JSON.stringify(SERVICE_ACCOUNT_OBJECT);

// Scopes required for the Google Calendar API
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.events.readonly',
  'https://www.googleapis.com/auth/calendar.readonly',
];

// Create a JWT client using the service account key
const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_FILE,
  scopes: SCOPES,
});


// Function to retrieve events and return a promise
export async function getEvents() {
  try {
    // Create a Calendar API client
    const calendar = google.calendar({ version: 'v3', auth });

    // Example usage: Get the ID of an existing calendar
    const calendarId = "finos.org_fac8mo1rfc6ehscg0d80fi8jig@group.calendar.google.com"

    const maxResults = 2500;
    const singleEvents = true;
    const timeMin = "2023-07-01T10:00:00Z"
    const timeMax = "2024-01-01T10:00:00Z"

    const events = await calendar.events.list({ calendarId, maxResults, singleEvents, timeMin, timeMax });

    if (events.data.items && events.data.items.length > 0) {
      // Map events to a simplified array of event data
      const mappedEvents: any = mapEvents(events.data.items);

      // Filter events without a title (including null or undefined titles)
      const filteredEvents = mappedEvents.filter((event: any) => event.title !== undefined && event.title !== '');

      // Save the events to a file
      saveEventsToFile(filteredEvents);

      return filteredEvents; // Return the filtered events array
    } else {
      console.log('No events found.');
      return []; // Return an empty array if no events are found
    }
  } catch (error) {
    console.error('Error retrieving calendar events:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

const eventsFilePath = './events.json';

function saveEventsToFile(events: calendar_v3.Schema$Event[]) {
  try {
    // Convert events array to JSON string
    const eventsJson = JSON.stringify(events, null, 2);

    // Write the JSON string to the file
    fs.writeFileSync(eventsFilePath, eventsJson);

    console.log('Events saved to file:', eventsFilePath);
  } catch (error) {
    console.error('Error saving events to file:', error);
    throw error;
  }
}

// Function to map events to a simplified array of event data
function mapEvents(events: calendar_v3.Schema$Event[]) {
  return events.map((eventData) => {
    return {
      title: eventData.summary,
      description: eventData.description,
      start: eventData.start?.dateTime,
      end: eventData.end?.dateTime
    };
  });
}

// Main function to initiate the events retrieval
async function main() {
  try {
    const allEvents = await getEvents(); // Wait for the getEvents() function to finish and store the events
    console.log('All events retrieved');
  } catch (error) {
    // Handle errors
    console.error('Error occurred:', error);
  }
}

main(); // Call the main function to start the events retrieval process