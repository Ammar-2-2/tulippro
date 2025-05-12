import { FaPlane, FaHandsHelping, FaHotel, FaCheck } from "react-icons/fa";
import Image from "next/image";

export default function Services() {
    return (
        <>
            <section id="services" className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    {/* Section Header */}
                    <div className="text-center mb-12 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-purple-600 mb-4">Onze Speciale Diensten</h2>
                        <p className="text-gray-700 text-md leading-relaxed">
                            Bij Tulip streven we ernaar om je reis naar Nederland en Europa een onvergetelijke ervaring te maken door
                            een breed scala aan op maat gemaakte toeristische diensten aan te bieden die perfect aansluiten bij jouw
                            behoeften. Of je nu een solo-trip, gezinsreis of reis met vrienden plant, wij zorgen ervoor dat je een
                            comfortabele en plezierige ervaring hebt tegen de beste prijzen en de hoogste kwaliteit van dienstverlening.
                        </p>
                    </div>

                    {/* Services Grid */}
                    <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {/* Card 1 */}
                        <div className="bg-white p-6 rounded-xl shadow hover:-translate-y-2 transition-all text-left">
                            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-purple-600 text-white text-xl mb-4 mx-auto">
                                <FaPlane />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Speciale Toeristische Programma&apos;s</h3>
                            <p className="text-gray-600 mb-4">Geniet van geweldige rondleidingen naar de beroemdste Europese bestemmingen</p>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex gap-2 items-start"><FaCheck className="text-purple-600 mt-1" /> Georganiseerde rondleidingen naar de belangrijkste bezienswaardigheden</li>
                                <li className="flex gap-2 items-start"><FaCheck className="text-purple-600 mt-1" /> Op maat gemaakte programma&apos;s die aansluiten bij jouw interesses</li>
                                <li className="flex gap-2 items-start"><FaCheck className="text-purple-600 mt-1" /> Professionele, meertalige gidsen</li>
                                <li className="flex gap-2 items-start"><FaCheck className="text-purple-600 mt-1" /> Dagtochten naar naburige Europese landen</li>
                            </ul>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white p-6 rounded-xl shadow hover:-translate-y-2 transition-all text-left">
                            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-purple-600 text-white text-xl mb-4 mx-auto">
                                <FaHandsHelping />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Ontvangst van Delegaties</h3>
                            <p className="text-gray-600 mb-4">Hoge kwaliteit ontvangst voor groepen en officiële delegaties</p>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex gap-2 items-start"><FaCheck className="text-purple-600 mt-1" /> Ontvangst op de luchthaven met gepersonaliseerde borden</li>
                                <li className="flex gap-2 items-start"><FaCheck className="text-purple-600 mt-1" /> Comfortabele transportdiensten voor alle behoeften</li>
                                <li className="flex gap-2 items-start"><FaCheck className="text-purple-600 mt-1" /> Stadsrondleidingen coördineren</li>
                                <li className="flex gap-2 items-start"><FaCheck className="text-purple-600 mt-1" /> Organiseren van vergaderingen en evenementen</li>
                            </ul>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white p-6 rounded-xl shadow hover:-translate-y-2 transition-all text-left">
                            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-purple-600 text-white text-xl mb-4 mx-auto">
                                <FaHotel />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Vlucht- en Hotelboekingen</h3>
                            <p className="text-gray-600 mb-4">De beste aanbiedingen en prijzen voor hotelboekingen</p>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex gap-2 items-start"><FaCheck className="text-purple-600 mt-1" /> Vluchtboekingen tegen concurrerende prijzen</li>
                                <li className="flex gap-2 items-start"><FaCheck className="text-purple-600 mt-1" /> Luxe en economische hotels</li>
                                <li className="flex gap-2 items-start"><FaCheck className="text-purple-600 mt-1" /> Appartementen voor gezinnen</li>
                                <li className="flex gap-2 items-start"><FaCheck className="text-purple-600 mt-1" /> Geweldige locaties nabij bezienswaardigheden</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Optional Banner */}
            <section className="relative w-full h-[30rem]  z-0 overflow-hidden">
                <Image
                    src="/assets/images/banner2.jpg"
                    alt="Speciale Aanbiedingen"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-30"
                />
            </section>
        </>
    );
}
