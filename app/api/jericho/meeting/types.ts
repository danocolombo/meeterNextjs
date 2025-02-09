type GROUP = {
    id: string;
    action: null | 'PUT' | 'DELETE' | 'POST';
};

export type PUT_DATA = {
    meeting: {
        id: string;
        action: null | 'PUT';
    };
    groups: GROUP[];
};

export type DB_DATA = {
    groups: GROUP[];
};
