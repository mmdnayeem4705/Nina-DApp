import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { doctorProfiles, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Get all doctors (with optional specialization filter)
export async function GET(request: NextRequest) {
  try {
    const specialization = request.nextUrl.searchParams.get('specialization');

    let query = db
      .select({
        id: users.id,
        fullName: users.fullName,
        walletAddress: users.walletAddress,
        specialization: doctorProfiles.specialization,
        yearsOfExperience: doctorProfiles.yearsOfExperience,
        consultationFee: doctorProfiles.consultationFee,
        bio: doctorProfiles.bio,
        isVerified: doctorProfiles.isVerified,
      })
      .from(doctorProfiles)
      .innerJoin(users, eq(doctorProfiles.userId, users.id));

    if (specialization) {
      query = query.where(eq(doctorProfiles.specialization, specialization));
    }

    const result = await query;

    return NextResponse.json({ doctors: result });
  } catch (error) {
    console.error('[v0] Get doctors error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}
