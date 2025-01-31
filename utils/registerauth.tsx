import { startRegistration } from "@simplewebauthn/browser";


export async function registerWebauthn() {
  const session = await fetch('/api/auth/session');
    const sessionData = await session.json();

    if (!sessionData?.user?.email) {
        alert("You must sign in with email or Google first!");
        return;
    }
    try {
        const optionsResponse = await fetch('/api/auth/webauthn/register');
        if (optionsResponse.status !== 200) {
            alert('Could not get registration options from server');
            return;
        }
        const opt = await optionsResponse.json();

        const credential = await startRegistration(opt);

        const response = await fetch('/api/auth/webauthn/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credential),
            credentials: 'include'
        });

        if (response.status !== 201) {
            alert('Could not register webauthn credentials.');
        } else {
            alert('Your webauthn credentials have been registered.');
        }
    } catch (err) {
        alert(`Registration failed. ${(err as Error).message}`);
    }
}