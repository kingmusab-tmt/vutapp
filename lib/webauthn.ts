import dbConnect from './connectdb';
import User from '@/models/user';

/**
 * Saves a challenge for a user, replacing any existing challenge.
 * @param userID - The ID of the user.
 * @param challenge - The challenge string to save.
 */
export async function saveChallenge({ userID, challenge }: { challenge: string; userID: string }) {
    await dbConnect();
    
    await User.updateOne(
        { _id: userID },
        { $set: { webAuthChallenge: challenge } }
    );
}

/**
 * Retrieves and deletes the stored challenge for a user.
 * @param userID - The ID of the user.
 * @returns The stored challenge or null if not found.
 */
export async function getChallenge(userID: string): Promise<string | null> {
    await dbConnect();
    
    const user = await User.findById(userID).select('webAuthChallenge');
    
    if (!user || !user.webAuthChallenge) return null;
    
    const challenge = user.webAuthChallenge;
    
    // Remove challenge after retrieval
    await User.updateOne({ _id: userID }, { $unset: { webAuthChallenge: "" } });
    
    return challenge;
}

/**
 * Stores the user's WebAuthn credentials in the database.
 * @param cred - The WebAuthCredential object.
 */
export async function saveCredentials(cred: { 
    transports: AuthenticatorTransport[]; 
    credentialID: string; 
    counter: number; 
    userID: string; 
    key: Buffer; 
}) {
    await dbConnect();
    
    await User.updateOne(
        { _id: cred.userID },
        { 
            $push: { 
                webAuthCredentials: {
                    credentialID: cred.credentialID,
                    transports: cred.transports,
                    credentialPublicKey: cred.key,
                    counter: cred.counter
                }
            }
        }
    );
}
