/*
 * The types for statistics's api.
 * Returned by the api.
 */

type StatusPageStatus = {
    page: {
        id: string;
        name: string;
        url: string;
        updated_at: string;
    };
    status: {
        indicator: string;
        description: string;
    };
};

type ServicesStatistics = {
    members: number;
    discord: number;
    projects: number;

    users: number;
    requests: number;
};

export type {
    StatusPageStatus,
    ServicesStatistics
};
