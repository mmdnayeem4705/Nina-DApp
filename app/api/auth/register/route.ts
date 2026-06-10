import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, doctorProfiles, patientProfiles } from '@/db/schema';
import { verifyMessage } from '@/lib/ethereum';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, role, fullName, message, signature } = await request.json();

    // Validate required fields
    if (!walletAddress || !role || !message || !signature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify signature
    const isValid = await verifyMessage(message, signature, walletAddress);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature. Please try again.' },
        { status: 401 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddress.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Wallet address already registered' },
        { status: 409 }
      );
    }

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        walletAddress: walletAddress.toLowerCase(),
        role: role as 'patient' | 'doctor',
        fullName: fullName || '',
      })
      .returning();

    const userId = newUser[0].id;

    // Create role-specific profile
    if (role === 'doctor') {
      // Generate a unique license number based on wallet address
      const uniqueLicenseNumber = `LIC_${walletAddress.substring(2, 10).toUpperCase()}_${Date.now()}`;
      await db.insert(doctorProfiles).values({
        userId: userId,
        specialization: 'general_medicine',
        licenseNumber: uniqueLicenseNumber,
        yearsOfExperience: 0,
        consultationFee: '0.00',
      });
    } else if (role === 'patient') {
      await db.insert(patientProfiles).values({
        userId: userId,
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser[0].id,
        walletAddress: newUser[0].walletAddress,
        role: newUser[0].role,
        fullName: newUser[0].fullName,
      },
    });
  } catch (error) {
    console.error('[v0] Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
    console.error('[v0] Error details:', errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
