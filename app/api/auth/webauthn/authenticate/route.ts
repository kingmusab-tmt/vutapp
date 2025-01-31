import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import dbConnect from '@/lib/connectdb';
import User from '@/models/user';
import { authOptions } from '@/auth';

/**
 * Handles GET /api/auth/webauthn/authenticate.
 * 
 * Generates and returns authentication options.
 */
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
        return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    }
    
    await dbConnect();
    
    const user = await User.findOne({ email }).select('webAuthCredentials webAuthChallenge');
    if (!user || user.webAuthCredentials.length === 0) {
        return NextResponse.json({ message: 'No registered credentials found.' }, { status: 404 });
    }
    
    const options = await generateAuthenticationOptions({
        userVerification: 'preferred',
    });
    
    options.allowCredentials = user.webAuthCredentials.map((cred: { credentialID: string; transports: string[] }) => ({
        id: cred.credentialID,
        type: 'public-key',
        transports: cred.transports,
    }));
    
    try {
        user.webAuthChallenge = options.challenge;
        await user.save();
    } catch (err) {
        return NextResponse.json({ message: 'Could not set up challenge.' }, { status: 500 });
    }
    
    return NextResponse.json(options, { status: 200 });
}
