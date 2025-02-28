export const getSample = async () => {
    return { id: '1' };
};
export const getAuthUser = async () => {
    let DEV = true;
    const platformValue = process.env.NEXT_PUBLIC_MEETER_PLATFORM || 'DEV';
    if (platformValue === 'PROD') {
        DEV = false;
    }
    const fetchFromApi = async () => {
        DEV ? console.log('fetching') : null;
        try {
            const res = await fetch('/api/test', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });
            const jsonData = await res.json();
            DEV ? console.log(jsonData) : null;
        } catch (error: any) {
            console.error(error);
        } finally {
            console.log('finally');
        }
    };
    await fetchFromApi();
    DEV ? console.log('DONE-DONE-DONE') : null;
};
