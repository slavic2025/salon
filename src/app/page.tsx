// // src/app/page.tsx

// import { serviceRepository } from '@/core/domains/services/service.repository'
// import { ServiceList } from '@/components/public/service-list'
// import { HeroSection } from '@/components/public/hero-section'
// import { BookingForm } from '@/components/public/booking-form/booking-form'

// // Aceasta este o componenta server-side, deci putem folosi async/await direct
// export default async function HomePage() {
//   // Apelam functia din repository pentru a lua serviciile active
//   const services = await serviceRepository.getActiveServices()

//   return (
//     <main className="flex min-h-screen flex-col items-center">
//       {/* Sectiunea principala de intampinare */}
//       <HeroSection />

//       {/* Secțiunea de Programare */}
//       <section id="programare" className="w-full bg-slate-50 py-16 sm:py-24">
//         <div className="mx-auto max-w-7xl px-6 lg:px-8">
//           <div className="text-center">
//             <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Programează-te Online</h2>
//             <p className="mt-4 text-lg leading-8 text-gray-600">
//               Rapid, simplu și convenabil. Alege serviciul și găsește un loc liber.
//             </p>
//           </div>
//           <div className="mt-12">
//             <BookingForm services={services} />
//           </div>
//         </div>
//       </section>

//       {/* Sectiunea care listeaza serviciile */}
//       <div className="w-full bg-slate-50 py-16 sm:py-24">
//         <div className="mx-auto max-w-7xl px-6 lg:px-8">
//           <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//             Serviciile Noastre
//           </h2>
//           <p className="mt-4 text-center text-lg leading-8 text-gray-600">
//             Descoperă gama noastră de servicii premium, create pentru a-ți oferi o experiență de neuitat.
//           </p>

//           {/* Componenta care randeaza lista de servicii */}
//           <ServiceList services={services} />
//         </div>
//       </div>
//     </main>
//   )
// }
