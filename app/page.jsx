'use client';
import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import {auth} from '@/app/firebase/config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter()
  const userSession = sessionStorage.getItem('user');
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', image: null });
  const [total, setTotal] = useState(0);



  useEffect(() => {
        if (!user && !userSession) {
          router.push('/sign-up');
        }
      }, [user, userSession, router]);
    
      if (!user && !userSession) {
        return null;} // Return null to avoid rendering the rest of the component during redirection

  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== '' && newItem.price !== '') {
      let imageUrl = '';
      if (newItem.image) {
        const imageRef = ref(storage, `images/${newItem.image.name}`);
        const snapshot = await uploadBytes(imageRef, newItem.image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
      await addDoc(collection(db, 'items'), {
        name: newItem.name.trim(),
        price: newItem.price,
        imageUrl: imageUrl,
      });
      setNewItem({ name: '', price: '', image: null });
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];
      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);

      const calculateTotal = () => {
        const totalPrice = itemsArr.reduce(
          (sum, item) => sum + parseFloat(item.price),
          0
        );
        setTotal(totalPrice);
      };
      calculateTotal();
      return () => unsubscribe();
    });
  }, []);

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'items', id));
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between sm:p-24 p-4'>
      <div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm '>
        <h1 className='text-4xl p-4 text-center'>Expense Tracker</h1>
        <div className='bg-slate-800 p-4 rounded-lg'>
          <form className='grid grid-cols-6 items-center text-black' onSubmit={addItem}>
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className='col-span-2 p-3 border'
              type='text'
              placeholder='Enter Item'
            />
            <input
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              className='col-span-2 p-3 border mx-3'
              type='number'
              placeholder='Enter $'
            />
            <input
              onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })}
              className='col-span-2 p-3 border'
              type='file'
              accept='image/*'
            />
            <button
              className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl'
              type='submit'
            >
              +
            </button>
          </form>
          <ul>
            {items.map((item) => (
              <li
                key={item.id}
                className='my-4 w-full flex justify-between bg-slate-950'
              >
                <div className='p-4 w-full flex justify-between items-center'>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className='w-16 h-16 object-cover mr-4' />
                  )}
                  <span className='capitalize'>{item.name}</span>
                  <span>${item.price}</span>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className='ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16'
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          {items.length < 1 ? (
            ''
          ) : (
            <div className='flex justify-between p-3'>
              <span>Total</span>
              <span>${total}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
