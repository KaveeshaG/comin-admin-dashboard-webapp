// api-client.ts
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
            // Try to parse error response as JSON first
            let errorData;
            const errorText = await response.text();
            
            try {
                // Attempt to parse error response as JSON
                errorData = JSON.parse(errorText);
                console.error('API Error Details:', {
                    status: response.status,
                    statusText: response.statusText,
                    url,
                    errorData,
                });
                
                throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
            } catch (parseError) {
                // If parsing fails, use the raw text
                console.error('API Error Details:', {
                    status: response.status,
                    statusText: response.statusText,
                    url,
                    errorText,
                });
                
                throw new Error(`API request failed with status ${response.status}: ${errorText}`);
            }
        }

        // Handle potential JSON parsing issues
        const text = await response.text();
        
        // If the response is empty, return an empty object or array
        if (!text || text.trim() === '') {
            return {} as T;
        }
        
        try {
            // Try to parse the response as JSON
            return JSON.parse(text) as T;
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.log('Raw response:', text);
            throw new Error(`Failed to parse response as JSON: ${(parseError as Error).message}`);
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        throw error;
    }
}