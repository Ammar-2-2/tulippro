'use client';
import { SignIn } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect_url') || '/dashboard';

    return (
        <div className="flex justify-center items-center min-h-screen">
            <SignIn
                appearance={{ elements: { card: "shadow-xl" } }}
                signUpUrl="/sign-up"
                unsafeMetadata={{ redirectUrl }}
            />
        </div>
    );
}
