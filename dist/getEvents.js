"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allEvents = void 0;
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
// Replace with the path to your service account JSON file
const SERVICE_ACCOUNT_FILE = './calendar-service-account.json';
// Scopes required for the Google Calendar API
const SCOPES = ['https://www.googleapis.com/auth/calendar.events.readonly'];
// Create a JWT client using the service account key
const auth = new googleapis_1.google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: SCOPES,
});
exports.allEvents = [];
function listEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create a Calendar API client
            const calendar = googleapis_1.google.calendar({ version: 'v3', auth });
            // Example usage: Get the ID of an existing calendar
            const calendarId = "finos.org_fac8mo1rfc6ehscg0d80fi8jig@group.calendar.google.com";
            const events = yield calendar.events.list({ calendarId });
            if (events.data.items && events.data.items.length > 0) {
                // Map events to a simplified array of event data
                const mappedEvents = mapEvents(events.data.items);
                // Filter events without a title (including null or undefined titles)
                const filteredEvents = mappedEvents.filter((event) => event.title !== undefined && event.title !== '');
                // Save the events to a file
                saveEventsToFile(filteredEvents);
                exports.allEvents.push(...filteredEvents);
            }
            else {
                console.log('No events found.');
            }
        }
        catch (error) {
            console.error('Error retrieving calendar events:', error);
        }
    });
}
const eventsFilePath = './events.json';
function saveEventsToFile(events) {
    try {
        // Convert events array to JSON string
        const eventsJson = JSON.stringify(events, null, 2);
        // Write the JSON string to the file
        fs_1.default.writeFileSync(eventsFilePath, eventsJson);
        console.log('Events saved to file:', eventsFilePath);
    }
    catch (error) {
        console.error('Error saving events to file:', error);
    }
}
// Function to map events to a simplified array of event data
function mapEvents(events) {
    return events.map((eventData) => {
        var _a, _b;
        return {
            title: eventData.summary,
            description: eventData.description,
            start: (_a = eventData.start) === null || _a === void 0 ? void 0 : _a.dateTime,
            end: (_b = eventData.end) === null || _b === void 0 ? void 0 : _b.dateTime
        };
    });
}
listEvents();
