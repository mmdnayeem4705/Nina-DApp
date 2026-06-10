import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { verifyMessage } from '@/lib/ethereum';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { oldWalletAddress, newWalletAddress, message, signature } = await request.json();

    // Validate required fields
    if (!oldWalletAddress || !newWalletAddress || !message || !signature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Normalize addresses
    const normalizedOldWallet = oldWalletAddress.toLowerCase();
    const normalizedNewWallet = newWalletAddress.toLowerCase();

    // Verify they're different
    if (normalizedOldWallet === normalizedNewWallet) {
      return NextResponse.json(
        { error: 'New wallet address must be different from current address' },
        { status: 400 }
      );
    }

    // Verify signature with new wallet address
    const isValid = await verifyMessage(message, signature, normalizedNewWallet);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature. Please sign with your new wallet.' },
        { status: 401 }
      );
    }

    // Check if old wallet exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, normalizedOldWallet))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: 'Current wallet address not found' },
        { status: 404 }
      );
    }

    // Check if new wallet is already in use
    const newWalletExists = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, normalizedNewWallet))
      .limit(1);

    if (newWalletExists.length > 0) {
      return NextResponse.json(
        { error: 'New wallet address is already registered' },
        { status: 409 }
      );
    }

    const user = existingUser[0];

    // Update wallet address
    await db
      .update(users)
      .set({
        walletAddress: normalizedNewWallet,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // Create new session with new wallet
    const sessionToken = Buffer.from(
      JSON.stringify({
        userId: user.id,
        walletAddress: normalizedNewWallet,
        role: user.role,
        fullName: user.fullName,
      })
    ).toString('base64');

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    console.log('[v0] Wallet changed successfully from', normalizedOldWallet, 'to', normalizedNewWallet);

    return NextResponse.json({
      success: true,
      message: 'Wallet address changed successfully',
      user: {
        id: user.id,
        walletAddress: normalizedNewWallet,
        role: user.role,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error('[v0] Change wallet error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to change wallet. Please try again.';
    console.error('[v0] Error details:', errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
