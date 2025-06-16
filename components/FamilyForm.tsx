'use client'; 

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs'; //  Haalt ingelogde gebruiker op

export default function FamilyForm() {
  //  Haalt de huidige gebruiker op via Clerk
  const { user } = useUser();

  //  State-variabelen voor het formulier
  const [adults, setAdults] = useState(1); // standaard 1 volwassenen
  const [children, setChildren] = useState(0);
  const [babies, setBabies] = useState(0);
  const [specialRequests, setSpecialRequests] = useState('');
  const [message, setMessage] = useState(''); //  Bevestigings- of foutmelding

  //  useEffect wordt uitgevoerd zodra het component geladen is
  // Hiermee halen we eventueel bestaande data op uit de database
  useEffect(() => {
    const load = async () => {
      if (!user?.id) return; // wacht tot user geladen is

      const res = await fetch('/api/family/' + user.id); // GET request met user_id
      if (res.ok) {
        const data = await res.json(); //  JSON response
        if (data) {
          //  Vul het formulier met bestaande gegevens
          setAdults(data.adults);
          setChildren(data.children);
          setBabies(data.babies);
          setSpecialRequests(data.special_requests || '');
        }
      }
    };

    load();
  }, [user?.id]); //  Alleen opnieuw uitvoeren als de gebruiker verandert

  //  Wordt aangeroepen bij het verzenden van het formulier
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return; // Geen user? Dan niet doorgaan.

    //  Verstuur de formulierdata naar de API (POST)
    const res = await fetch('/api/family', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        user_email: user.emailAddresses?.[0]?.emailAddress, // eerste e-mailadres
        adults,
        children,
        babies,
        specialRequests,
      }),
    });

    //  Geef feedback aan de gebruiker
    setMessage(res.ok ? 'Gegevens opgeslagen!' : 'Fout bij opslaan.');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-4 bg-black text-white p-2">Mijn gezin</h2>

      {/* Input: Volwassenen */}
      <label className="block mb-2 bg-black text-white p-1">
        Volwassenen:
        <input
          type="number"
          value={adults}
          onChange={(e) => setAdults(Number(e.target.value))}
          className="w-full border p-2"
        />
      </label>

      {/* Input: Kinderen */}
      <label className="block mb-2 bg-black text-white p-1">
        Kinderen:
        <input
          type="number"
          value={children}
          onChange={(e) => setChildren(Number(e.target.value))}
          className="w-full border p-2"
        />
      </label>

      {/* Input: Baby’s */}
      <label className="block mb-2 bg-black text-white p-1">
        Baby’s:
        <input
          type="number"
          value={babies}
          onChange={(e) => setBabies(Number(e.target.value))}
          className="w-full border p-2"
        />
      </label>

      {/* Input: Speciale wensen */}
      <label className="block mb-4 bg-black text-white p-1">
        Speciale wensen:
        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          className="w-full border p-2"
        />
      </label>

      {/* Verzenden knop */}
      <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
        Opslaan
      </button>

      {/*  Toon feedback */}
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </form>
  );
}
