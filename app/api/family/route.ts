import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mysql'; 

//  POST: sla familiegegevens op of werk ze bij
export async function POST(req: NextRequest) {
  const body = await req.json(); //  Haal data uit de body van het verzoek

  const {
    user_id,
    user_email,
    adults,
    children,
    babies,
    specialRequests,
  } = body;

  try {
    //  Insert of update bestaande familie (per gebruiker)
    await executeQuery({
      query: `
        INSERT INTO family_info (user_id, user_email, adults, children, babies, special_requests)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          adults = VALUES(adults),
          children = VALUES(children),
          babies = VALUES(babies),
          special_requests = VALUES(special_requests)
      `,
      values: [user_id, user_email, adults, children, babies, specialRequests],
    });

    //  Verstuur succesvolle response
    return NextResponse.json({ message: 'Opgeslagen of bijgewerkt' });
  } catch (error) {
    //  Fout afhandelen
    console.error('Fout bij opslaan:', error);
    return NextResponse.json({ message: 'Fout bij opslaan' }, { status: 500 });
  }
}

//  GET: Haal alle gezinnen op (voor de adminlijst)
export async function GET() {
  try {
    //  Haal alles op gesorteerd op laatst toegevoegd
    const result = await executeQuery({
      query: 'SELECT * FROM family_info ORDER BY created_at DESC',
    });

    return NextResponse.json(result); //  Geef de data terug als JSON
  } catch (error) {
    //  Fout bij ophalen
    console.error('Fout bij ophalen van gezinssamenstellingen:', error);
    return NextResponse.json({ message: 'Fout bij ophalen' }, { status: 500 });
  }
}
