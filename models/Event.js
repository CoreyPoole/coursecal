import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this event.'],
  },
  start: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  end: {
    type: Date,
    required: [true, 'End date is required'],
  },
  type: {
    type: String,
    enum: ['lesson', 'tutoring', 'admin'],
    default: 'lesson',
  },
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);