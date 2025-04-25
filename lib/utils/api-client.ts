type ServiceName = 'auth' | 'organizations' | 'employees' | 'leaves';

const SERVICE_MAPPINGS: Record<ServiceName, string> = {
    auth: 'https://comin.kaveeshagimhana.com',
    organizations: 'https://comin.kaveeshagimhana.com',
    employees: 'https://comin.kaveeshagimhana.com',
    leaves: 'https://comin.kaveeshagimhana.com'
};

export async function apiClient<T>(
    endpoint: string,
    options: RequestInit = {},
    serviceName: ServiceName = 'organizations'
): Promise<T> {
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    const url = `/api/proxy/${serviceName}${formattedEndpoint}`;

    const defaultHeaders = {
        "Content-Type": "application/json",
    };

    try {
        const response = await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('API Error Details:', {
                status: response.status,
                statusText: response.statusText,
                url,
                errorBody,
            });

            throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
        }

        return response.json();
    } catch (error) {
        console.error('Fetch Error:', error);
        throw error;
    }
}