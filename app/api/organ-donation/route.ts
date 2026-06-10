import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { organDonationForms } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Get organ donation forms for a patient
export async function GET(request: NextRequest) {
  try {
    const patientId = request.nextUrl.searchParams.get('patientId');

    if (!patientId) {
      return NextResponse.json(
        { error: 'Missing patientId' },
        { status: 400 }
      );
    }

    const forms = await db
      .select()
      .from(organDonationForms)
      .where(eq(organDonationForms.patientId, parseInt(patientId)));

    return NextResponse.json({ forms });
  } catch (error) {
    console.error('[v0] Get organ donation forms error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organ donation forms' },
      { status: 500 }
    );
  }
}

// Create new organ donation form
export async function POST(request: NextRequest) {
  try {
    const {
      patientId,
      doctorId,
      organs,
      bloodType,
      medicalConditions,
      familyConsent,
    } = await request.json();

    if (!patientId || !doctorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newForm = await db
      .insert(organDonationForms)
      .values({
        patientId: parseInt(patientId),
        doctorId: parseInt(doctorId),
        organs: JSON.stringify(organs) || '[]',
        bloodType: bloodType || '',
        medicalConditions: medicalConditions || '',
        familyConsent: familyConsent || false,
        status: 'active',
      })
      .returning();

    return NextResponse.json({
      success: true,
      form: newForm[0],
    });
  } catch (error) {
    console.error('[v0] Create organ donation form error:', error);
    return NextResponse.json(
      { error: 'Failed to create organ donation form' },
      { status: 500 }
    );
  }
}
