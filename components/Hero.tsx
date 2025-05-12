import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="py-[150px] pb-20 bg-gradient-to-br from-cyan-100 via-yellow-50 to-white"
    >
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="text-left md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-snug mb-6">
            <span className="text-purple-600">Tulip Tours</span> - Jouw Gids voor het Ontdekken van Nederland en Europa
          </h1>
          <p className="text-gray-700 text-lg mb-8">
            Ontdek de magie van Nederland en Europa met Tulip Tours! Wij bieden unieke reiservaringen, plezierige rondleidingen en persoonlijke diensten om je reis onvergetelijk te maken.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-4">
            <Link
              href="#contact"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-semibold text-center"
            >
              Boek nu
            </Link>
            <Link
              href="#offers"
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-6 py-3 rounded-md font-semibold text-center"
            >
              Onze Aanbiedingen
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full h-[500px] relative rounded-xl shadow-lg overflow-hidden">
          <Image
            src="/assets/images/logo.png"
            alt="Toerisme Europa"
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}
