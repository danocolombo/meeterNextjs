export async function createMeeterSession(userId: string) {
    const response = await fetch('/api/meeter/session', {
        method: 'POST',
    });
    return await response.json();
}
