export const getSample = async () => {
    return { id: '1' };
};
export const getAuthUser = async () => {
    const fetchFromApi = async () => {
        console.log('fetching');
        try {
            const res = await fetch('/api/test', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });
            const jsonData = await res.json();
            console.log(jsonData);
        } catch (error: any) {
            console.error(error);
        } finally {
            console.log('finally');
        }
    };
    await fetchFromApi();
    console.log('DONE-DONE-DONE');
};
