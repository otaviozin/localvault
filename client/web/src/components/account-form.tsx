'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { usePathname } from 'next/navigation';
import { SignIn, SignUp } from '@/api/auth/user';

const formSchema = z
    .object({
        username: z
            .string()
            .min(3, 'Username must be at least 3 characters long')
            .max(20, 'Username cannot exceed 20 characters'),
        email: z.email('This is not a valid email').min(1, { message: 'This field is required' }),
        password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
        confirmPassword: z.string().min(8, { message: 'Please confirm your password' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

export function AccountForm() {
    const pathName = usePathname();
    const path = pathName === '/signin' ? 'Sign In' : 'Sign Up';

    const isDev = process.env.NEXT_PUBLIC_APP_ENV === 'DEV';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: isDev
            ? {
                  username: 'testuser',
                  email: 'test@example.com',
                  password: 'password123',
                  confirmPassword: 'password123',
              }
            : {
                  username: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
              },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (path === 'Sign In') {
            SignIn(values);
        } else {
            SignUp(values);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                {path === 'Sign Up' && (
                    <FormField
                        control={form.control}
                        name='username'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input type='text' placeholder='Your username' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type='email' placeholder='you@example.com' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type='password' placeholder='********' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {path === 'Sign Up' && (
                    <FormField
                        control={form.control}
                        name='confirmPassword'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type='password' placeholder='********' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <Button type='submit'>{path}</Button>
            </form>
        </Form>
    );
}
