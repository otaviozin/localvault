'use client';

import { AccountForm } from '@/components/forms/account-form';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Register() {
    return (
        <div className='w-screen h-screen place-items-center place-content-center'>
            <Card className='w-full max-w-sm'>
                <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>Enter your email below to create your account</CardDescription>
                    <CardAction>
                        <Button asChild variant='link'>
                            <Link href='/signin'>Sign In</Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <AccountForm />
                </CardContent>
            </Card>
        </div>
    );
}
