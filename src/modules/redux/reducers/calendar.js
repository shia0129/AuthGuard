import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  calendarView: 'dayGridMonth',
  error: false,
  events: [],
  isModalOpen: false,
  selectedEventId: null,
  selectedRange: null,
};

// ==============================|| CALENDAR - SLICE ||============================== //

const calendar = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    // error
    hasError(state, action) {
      state.error = action.payload;
    },

    // event list
    setEvents(state, action) {
      state.events = action.payload;
    },

    // update calendar view
    updateCalendarView(state, action) {
      state.calendarView = action.payload;
    },

    // select event
    selectEvent(state, action) {
      const eventId = action.payload;
      state.isModalOpen = true;
      state.selectedEventId = eventId;
    },

    // create event
    createEvent(state, action) {
      state.isModalOpen = false;
      state.events = action.payload;
    },

    // update event
    updateEvent(state, action) {
      state.isModalOpen = false;
      state.selectedEventId = null;
      state.events = action.payload;
    },

    // delete event
    deleteEvent(state, action) {
      const { eventId } = action.payload;
      state.isModalOpen = false;
      state.events = state.events.filter((user) => user.id !== eventId);
    },

    // select date range
    selectRange(state, action) {
      const { start, end, tmpStart, tmpEnd, resourceId, allDay } = action.payload;
      state.isModalOpen = true;
      state.selectedRange = { start, end, tmpStart, tmpEnd, resourceId, allDay };
    },

    // modal toggle
    toggleModal(state) {
      state.isModalOpen = !state.isModalOpen;
      if (state.isModalOpen === false) {
        state.selectedEventId = null;
        state.selectedRange = null;
      }
    },
  },
});

export default calendar.reducer;

export const {
  selectEvent,
  toggleModal,
  updateCalendarView,
  deleteEvent,
  updateEvent,
  createEvent,
  selectRange,
} = calendar.actions;
