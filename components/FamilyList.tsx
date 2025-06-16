'use client';

import { useEffect, useState } from 'react';

//  TypeScript type voor een gezinssamenstelling
type Family = {
  id: number;
  user_id: string;
  user_email: string;
  adults: number;
  children: number;
  babies: number;
  special_requests: string;
  created_at: string;
};

export default function FamilyList() {
  //  State voor lijst met gezinnen
  const [families, setFamilies] = useState<Family[]>([]);

  //  State voor laadstatus en foutmelding
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  //  useEffect om data op te halen zodra de component geladen is
  useEffect(() => {
    fetch('/api/family')
      .then((res) => {
        if (!res.ok) throw new Error('Kon gezinssamenstellingen niet ophalen');
        return res.json(); //  Parse JSON van de API response
      })
      .then((data) => {
        setFamilies(data);   //  Zet de opgehaalde data in state
        setLoading(false);   // Zet loading op false
      })
      .catch((err) => {
        console.error('Error fetching families:', err);
        setError('Fout bij ophalen van gegevens.'); //  Foutmelding tonen
        setLoading(false);
      });
  }, []);

  //  Laat "Laden..." zien terwijl data nog opgehaald wordt
  if (loading) return <p className="text-gray-600">Laden...</p>;

  //  Laat foutmelding zien als ophalen mislukt is
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/*  Titel */}
      <h1 className="text-2xl font-bold mb-6 text-purple-700">Ingevulde gezinnen</h1>

      {/*  Toon bericht als er nog geen gezinnen zijn */}
      {families.length === 0 ? (
        <p className="text-gray-500">Er zijn nog geen gezinssamenstellingen ingevoerd.</p>
      ) : (
        //  Tabel met alle ingevulde gezinnen
        <div className="overflow-x-auto bg-black">
          <table className="min-w-full border border-gray-300 text-sm bg-black">
            <thead className="bg-black text-left">
              <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Gebruiker ID</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Volwassenen</th>
                <th className="border px-4 py-2">Kinderen</th>
                <th className="border px-4 py-2">Baby’s</th>
                <th className="border px-4 py-2">Wensen</th>
                <th className="border px-4 py-2">Datum</th>
              </tr>
            </thead>
            <tbody>
              {families.map((fam) => (
                <tr key={fam.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{fam.id}</td>
                  <td className="border px-4 py-2">{fam.user_id}</td>

                  {/*  Klikbare email */}
                  <td className="border px-4 py-2">
                    <a href={`mailto:${fam.user_email}`} className="text-blue-600 underline">
                      {fam.user_email}
                    </a>
                  </td>

                  {/*  Aantallen per gezinslid-type */}
                  <td className="border px-4 py-2">{fam.adults}</td>
                  <td className="border px-4 py-2">{fam.children}</td>
                  <td className="border px-4 py-2">{fam.babies}</td>

                  {/*  Speciale wensen tonen of streepje als leeg */}
                  <td className="border px-4 py-2">{fam.special_requests || '-'}</td>

                  {/*  Datum netjes formatteren in NL-stijl */}
                  <td className="border px-4 py-2">
                    {new Date(fam.created_at).toLocaleDateString('nl-NL')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
