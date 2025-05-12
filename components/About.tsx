export default function AboutSection() {
    return (
        <section id="about" className="bg-white py-20 px-4">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center text-left">
                {/* Text Content */}
                <div>
                    <h2 className="text-3xl font-bold text-[#11999D] mb-6">📌 Wie zijn wij?</h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        Wij zijn <span className="font-semibold">Tulip Tours</span>, een reisbedrijf dat gespecialiseerd is in het aanbieden van de beste reiservaringen in Nederland en Europa. We streven ernaar om uitstekende diensten te bieden voor reizigers van over de hele wereld, of je nu op zoek bent naar een rondleiding, ontvangstservices of vluchten en hotelboekingen. Ons doel is om je reis soepel, plezierig en onvergetelijk te maken.
                    </p>

                    <h3 className="text-xl font-semibold text-[#11999D] mt-6 mb-2">🌟 Waarom kiezen voor ons?</h3>
                    <ul className="space-y-2 text-gray-600">
                        <li>✔️ Uitgebreide ervaring in de reisindustrie</li>
                        <li>✔️ Complete diensten van planning tot uitvoering</li>
                        <li>✔️ Klanttevredenheid van 98%</li>
                        <li>✔️ Speciale aanbiedingen en concurrerende prijzen</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-[#11999D] mt-6 mb-2">🎯 Onze visie en missie</h3>
                    <p className="tspace-y-2 text-gray-600"><strong >Onze visie:</strong> De nummer één keuze zijn voor reizigers die Europa willen ontdekken.</p>
                    <p className="tspace-y-2 text-gray-600"><strong>Onze missie:</strong> Betrouwbare en hoogwaardige toeristische diensten aanbieden die voldoen aan de behoeften van alle reizigers, met een focus op innovatie, comfort en unieke ervaringen.</p>
                </div>

                {/* Image */}
                <div>
                    <img
                        src="/assets/images/hero2.jpeg"
                        alt="About Tulip Tours"
                        className="w-full h-auto rounded-lg shadow-md"
                    />
                </div>
            </div>
        </section>
    );
}
