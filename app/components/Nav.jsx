'use client'
import React from 'react'
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '@/app/firebase/config'
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
function Nav() {
    const router = useRouter()
    return (
        <div className='flex items-center gap-2'>
            <a href='/sign-in' className="mt-4 p-2 bg-cyan-700 text-white rounded">
                Log in
            </a>
            <button
                onClick={() => {
                    signOut(auth);
                    sessionStorage.removeItem('user');
                    router.push('/sign-in');
                }}
                className="mt-4 p-2 bg-red-500 text-white rounded"
            >
                Log out
            </button>
        </div>
    )
}

export default Nav