'use server';

import { cookies } from 'next/headers';
import { Gateway } from '..';

export const AuthGateway = Gateway.create({
    baseURL: Gateway.defaults.baseURL + '/auth',
});

export const SignUp = async (data: any) => {
    const response = await AuthGateway.post('/create-user', data);
    return response.data;
};

export const SignIn = async (data: any) => {
    const response = await AuthGateway.post('/login', data);
    return response.data;
};

export const Me = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) return null;

    try {
        const response = await AuthGateway.get('/authorize/me', {
            headers: {
                Cookie: `access_token=${token}`,
            },
        });

        return response.data;
    } catch (err) {
        console.error(err);
    }
};
