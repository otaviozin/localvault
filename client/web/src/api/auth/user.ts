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
    const response = await AuthGateway.get('/authorize/me', {
        withCredentials: true,
    });

    return response.data;
};
