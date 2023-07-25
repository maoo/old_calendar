import allEvents from '../events.js';
import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import tippy from 'tippy.js'; 
import modal from 'vanilla-js-modal'; 
import 'tippy.js/dist/tippy.css'; 
import './index.css';

console.log('view.js loaded')

document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');

    // Get the current date as a string in the format 'YYYY-MM-DD'
    const currentDate = new Date().toISOString().slice(0, 10);
  
    var calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        initialDate: currentDate,
        navLinks: true, // can click day/week names to navigate views
        editable: true,
        dayMaxEvents: true, // allow "more" link when too many events
        events: allEvents,
        eventContent: function (info) {
            return {
              html: `<b>${info.event.title}</b><br>${info.event.extendedProps.description || ''}`
            };
          },
        eventDidMount: function (info) {
            // Attach a tooltip to the event element
            tippy(info.el, {
                content: info.event.extendedProps.description,
                interactive: true,
                trigger: 'click', // Show the tooltip on click
                onShow(instance) {
                    // Create a clickable popup when the tooltip is shown
                    const modalContent = document.createElement('div');
                    modalContent.innerHTML = info.event.extendedProps.description;
                    modalContent.classList.add('modal-content');
                    instance.setContent(modalContent);
        
                    // Add a close button to the popup
                    const closeButton = document.createElement('button');
                    closeButton.innerHTML = 'Close';
                    closeButton.classList.add('modal-close');
                    closeButton.addEventListener('click', () => instance.hide());
                    modalContent.appendChild(closeButton);
                },
            });
        }
    });
  
    calendar.render();
});