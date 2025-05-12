'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

type Package = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  start_date: string;
  end_date: string;
};

export default function TourPackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const fetchPackages = async () => {
      const { data, error } = await supabase.from('packages').select('*');
      if (!error) {
        const today = new Date();
        const filtered = data.filter(pkg => new Date(pkg.start_date) > today);
        setPackages(filtered);
      } else {
        console.error('Error fetching packages:', error.message);
      }
    };
    fetchPackages();
  }, []);


  const handleBook = async (pkgId: string) => {
    if (!user) {
      localStorage.setItem('selected_package', pkgId);
      router.push(`/auth/sign-up?redirect_url=/dashboard`);
      return;
    }

    const { error } = await supabase.from('bookings').insert({
      user_id: user.id,
      package_id: pkgId,
    });

    if (!error) {
      router.push('/dashboard');
    } else {
      alert('Boeking mislukt');
    }
  };

  return (
    <section id="offers" className="bg-gray-100 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-purple-700 mb-4">Onze Speciale Aanbiedingen</h2>
        <p className="text-gray-700 mb-10 max-w-3xl mx-auto">
          Bij Tulip bieden we op maat gemaakte reisaanbiedingen en -pakketten aan die zijn ontworpen om aan ieders wensen en budget te voldoen. Of je nu op zoek bent naar unieke rondreizen, betaalbare vliegtickets en hotelboekingen, of luxe ontvangst- en transportdiensten, wij hebben alles wat je nodig hebt.
        </p>

        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-8"
        >
          {packages.map((pkg) => (
            <SwiperSlide key={pkg.id}>
              <div className="bg-white rounded-xl shadow p-4 text-left"> {/* Changed text-right to text-left */}
                <img
                  src={pkg.image_url}
                  alt={pkg.title}
                  className="w-full h-48 object-cover rounded mb-4 hover:scale-105 transition-transform duration-300"
                />
                <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{pkg.description}</p>
                <p className="text-gray-500 text-xs mb-3">
                  {pkg.start_date} - {pkg.end_date}
                </p>
                <button
                  onClick={() => handleBook(pkg.id)}
                  className="mt-auto px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Boek nu
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
