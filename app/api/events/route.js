import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Event from '@/models/Event';

export async function GET() {
  try {
    await connectToDatabase();
    const events = await Event.find({});
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    // This will now send the exact error back as JSON!
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const event = await Event.create(body);
    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE: Removes an event from the database based on its unique ID
export async function DELETE(request) {
  try {
    await connectToDatabase();
    
    // Extract the ID from the URL (e.g., /api/events?id=123)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'No ID provided' }, { status: 400 });
    }

    // Tell MongoDB to find this ID and delete the document
    await Event.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}