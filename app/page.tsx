'use client';
import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function Dashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [newEvent, setNewEvent] = useState({ title: '', type: 'lesson' });
  const [eventToDelete, setEventToDelete] = useState<any>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const json = await res.json();
        if (json.success) {
          const formattedEvents = json.data.map((event: any) => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end)
          }));
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchEvents();
  }, []);

  const eventStyleGetter = (event: any) => {
    const uniqueString = event._id || event.title;
    let hash = 0;
    
    for (let i = 0; i < uniqueString.length; i++) {
      hash = uniqueString.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = Math.abs(hash % 360);
    const backgroundColor = `hsl(${hue}, 70%, 60%)`;

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        color: 'white',
        border: 'none',
        display: 'block'
      }
    };
  };

  const handleSelectSlot = (slotInfo: any) => {
    setSelectedSlot(slotInfo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewEvent({ title: '', type: 'lesson' });
    setSelectedSlot(null);
  };

  const handleSaveEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newEvent.title && selectedSlot) {
      const eventData = {
        title: newEvent.title,
        start: selectedSlot.start,
        end: selectedSlot.end,
        type: newEvent.type,
      };

      try {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
        });

        if (res.ok) {
          const savedEventRes = await res.json();
          const savedEvent = savedEventRes.data;

          savedEvent.start = new Date(savedEvent.start);
          savedEvent.end = new Date(savedEvent.end);

          setEvents([...events, savedEvent]);
          closeModal();
        } else {
          const errorData = await res.json();
          alert(`Database error: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Failed to save event:", error);
      }
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete || !eventToDelete._id) return;

    try {
      const res = await fetch(`/api/events?id=${eventToDelete._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setEvents(events.filter(e => e._id !== eventToDelete._id));
        setEventToDelete(null);
      } else {
        const errorData = await res.json();
        alert(`Failed to delete: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans relative">
      <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">CourseCal</h1>
          <p className="text-slate-500">Interactive Planner for Educators</p>
        </div>
        <button
          onClick={() => alert("Drag on the calendar to add an event!")}
          className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add Event
        </button>
      </header>

      <main className="bg-white p-6 rounded-xl shadow-sm h-[75vh]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={eventStyleGetter}
          selectable={true}
          defaultView="week"
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(event) => setEventToDelete(event)} 
        />
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative z-50">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Schedule New Event</h2>

            <form onSubmit={handleSaveEvent}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., General Lesson: Algebra"
                  value={newEvent.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category
                </label>
                <select
                  className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={newEvent.type}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewEvent({ ...newEvent, type: e.target.value })}
                >
                  <option value="lesson">General Lesson</option>
                  <option value="tutoring">Tutoring Session</option>
                  <option value="admin">Administrative</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow transition"
                >
                  Save to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative z-50 text-center">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Delete Event?</h2>
            <p className="text-slate-600 mb-6">
              Are you sure you want to remove <span className="font-semibold">"{eventToDelete.title}"</span> from your schedule?
            </p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setEventToDelete(null)}
                className="px-5 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteEvent}
                className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 shadow transition"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}