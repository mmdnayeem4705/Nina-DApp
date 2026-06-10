import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { appointments } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Update appointment status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, paymentStatus, paymentTxHash } = await request.json();
    const appointmentId = parseInt(params.id);

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;
    if (paymentTxHash) updateData.paymentTxHash = paymentTxHash;
    updateData.updatedAt = new Date();

    const updated = await db
      .update(appointments)
      .set(updateData)
      .where(eq(appointments.id, appointmentId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      appointment: updated[0],
    });
  } catch (error) {
    console.error('[v0] Update appointment error:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

// Get single appointment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointmentId = parseInt(params.id);

    const result = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, appointmentId));

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ appointment: result[0] });
  } catch (error) {
    console.error('[v0] Get appointment error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 }
    );
  }
}
