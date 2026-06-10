import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { appointments, paymentTransactions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// Get appointments for a user (patient or doctor)
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const userRole = request.nextUrl.searchParams.get('role');

    if (!userId || !userRole) {
      return NextResponse.json(
        { error: 'Missing userId or role' },
        { status: 400 }
      );
    }

    let result;
    const userIdNum = parseInt(userId);

    if (userRole === 'patient') {
      result = await db
        .select()
        .from(appointments)
        .where(eq(appointments.patientId, userIdNum));
    } else if (userRole === 'doctor') {
      result = await db
        .select()
        .from(appointments)
        .where(eq(appointments.doctorId, userIdNum));
    } else {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    return NextResponse.json({ appointments: result });
  } catch (error) {
    console.error('[v0] Get appointments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// Create new appointment
export async function POST(request: NextRequest) {
  try {
    const {
      patientId,
      doctorId,
      appointmentDate,
      reason,
      symptoms,
      allergies,
      bloodGroup,
      description,
      consultationFee,
    } = await request.json();

    if (!patientId || !doctorId || !appointmentDate || !consultationFee) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newAppointment = await db
      .insert(appointments)
      .values({
        patientId: parseInt(patientId),
        doctorId: parseInt(doctorId),
        appointmentDate: new Date(appointmentDate),
        reason: reason || '',
        symptoms: symptoms || '',
        allergies: allergies || '',
        bloodGroup: bloodGroup || '',
        description: description || '',
        consultationFee: consultationFee.toString(),
        status: 'pending',
        paymentStatus: false,
      })
      .returning();

    return NextResponse.json({
      success: true,
      appointment: newAppointment[0],
    });
  } catch (error) {
    console.error('[v0] Create appointment error:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
