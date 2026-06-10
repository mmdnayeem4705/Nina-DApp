import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { verifyMessage } from '@/lib/ethereum';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, message, signature } = await request.json();

    // Validate required fields
    if (!walletAddress || !message || !signature) {
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

    // Find user
    const foundUser = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddress.toLowerCase()))
      .limit(1);

    if (foundUser.length === 0) {
      return NextResponse.json(
        { error: 'Wallet address not registered. Please register first.' },
        { status: 404 }
      );
    }

    const user = foundUser[0];

    // Create session token (simple JWT-like token)
    const sessionToken = Buffer.from(
      JSON.stringify({
        userId: user.id,
        walletAddress: user.walletAddress,
        role: user.role,
        iat: Date.now(),
      })
    ).toString('base64');

    // Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        role: user.role,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error('[v0] Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
