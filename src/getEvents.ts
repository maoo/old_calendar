import { calendar_v3, google } from 'googleapis';
import fs from 'fs';

// Replace with the path to your service account JSON file
const SERVICE_ACCOUNT_FILE = './calendar-service-account.json';

// Scopes required for the Google Calendar API
const SCOPES = ['https://www.googleapis.com/auth/calendar',
'https://www.googleapis.com/auth/calendar.events',
'https://www.googleapis.com/auth/calendar.events.readonly',
'https://www.googleapis.com/auth/calendar.readonly',];

// Create a JWT client using the service account key
const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_FILE,
  scopes: SCOPES,
});

export const allEvents: calendar_v3.Schema$Event[] = [];

// Function to retrieve events and return a promise
async function listEvents() {
  try {
    // Create a Calendar API client
    const calendar = google.calendar({ version: 'v3', auth });

    // Example usage: Get the ID of an existing calendar
    const calendarId = "finos.org_fac8mo1rfc6ehscg0d80fi8jig@group.calendar.google.com"

    const events = await calendar.events.list({ calendarId });

    if (events.data.items && events.data.items.length > 0) {
      // Map events to a simplified array of event data
      const mappedEvents: any = mapEvents(events.data.items);

      // Filter events without a title (including null or undefined titles)
      const filteredEvents = mappedEvents.filter((event: any) => event.title !== undefined && event.title !== '');

      // Save the events to a file
      saveEventsToFile(filteredEvents);
      allEvents.push(...filteredEvents);
    } else {
      console.log('No events found.');
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
    throw error; // Rethrow the error to be handled by the caller
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
    await listEvents(); // Wait for the listEvents() function to finish
    console.log('All events retrieved');
    // Any code that depends on the events should be placed here
  } catch (error) {
    // Handle errors
    console.error('Error occurred:', error);
  }
}

main(); // Call the main function to start the events retrieval process
