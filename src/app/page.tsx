import { Button } from '@/components/ui/button';
import { Search, Star, BarChart, Bell, Users } from 'lucide-react';
import { SignInButton } from '@clerk/nextjs';
import SearchForm from './_components/search-form';

export default function Home() {
  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Implementar funcionalidad de búsqueda aquí
  //   console.log('Búsqueda enviada');
  // };

  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-zinc-500">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                Descubre la Escena de Cerveza Artesanal con Mash
              </h1>
              <p className="max-w-[600px] text-white mx-auto md:text-xl">
                Encuentra, califica y comparte tus cervezas artesanales
                colombianas favoritas. ¡Únete a la comunidad de entusiastas de
                la cerveza en Mash!
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <SearchForm />
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <SignInButton>
                <Button size="lg">Regístrate en Mash</Button>
              </SignInButton>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container  mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
            Características Principales de Mash
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 md:gap-4 lg:gap-8">
            <div className="w-full md:w-1/2 flex flex-col">
              <div className="flex flex-col space-y-1.5 p-6">
                <Search className="w-10 h-10 text-primary mb-2" />
                <h3 className="font-semibold tracking-tight text-xl">
                  Descubre Cervezas
                </h3>
              </div>
              <div className="p-6 pt-0 flex-grow">
                <p className="text-muted-foreground text-base">
                  Explora una amplia variedad de cervezas artesanales
                  colombianas. Encuentra nuevas cervezas basadas en tus
                  preferencias y descubre gemas ocultas en la escena cervecera
                  local.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col">
              <div className="flex flex-col space-y-1.5 p-6">
                <Star className="w-10 h-10 text-primary mb-2" />
                <h3 className="font-semibold tracking-tight text-xl">
                  Califica y Reseña
                </h3>
              </div>
              <div className="p-6 pt-0 flex-grow">
                <p className="text-muted-foreground text-base">
                  Comparte tus opiniones sobre las cervezas que has probado.
                  Califica tus favoritas, escribe reseñas detalladas y ayuda a
                  otros amantes de la cerveza a encontrar su próxima cerveza
                  favorita.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container  mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
            Para Cervecerías y Dueños de Negocios
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 md:gap-4 lg:gap-8">
            <div className="w-full md:w-1/3 flex flex-col">
              <div className="flex flex-col space-y-1.5 p-6">
                <Users className="w-10 h-10 text-primary mb-2" />
                <h3>Interactúa con tus Clientes</h3>
              </div>
              <div className="p-6 pt-0 flex-grow">
                <p className="text-muted-foreground text-base">
                  Conecta directamente con los amantes de la cerveza. Responde a
                  reseñas, organiza eventos y crea una comunidad leal alrededor
                  de tu marca.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/3 flex flex-col">
              <div className="flex flex-col space-y-1.5 p-6">
                <BarChart className="w-10 h-10 text-primary mb-2" />
                <h3>Analíticas Detalladas</h3>
              </div>
              <div className="p-6 pt-0 flex-grow">
                <p className="text-muted-foreground text-base">
                  Obtén información valiosa sobre las preferencias de tus
                  clientes. Analiza tendencias, calificaciones y comentarios
                  para mejorar tus productos y estrategias.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/3 flex flex-col">
              <div className="flex flex-col space-y-1.5 p-6">
                <Bell className="w-10 h-10 text-primary mb-2" />
                <h3>Publica Actualizaciones</h3>
              </div>
              <div className="p-6 pt-0 flex-grow">
                <p className="text-muted-foreground text-base">
                  Mantén a tus seguidores informados sobre nuevos lanzamientos,
                  eventos especiales y ofertas exclusivas. Aumenta la
                  visibilidad de tus cervezas en la comunidad de Mash.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-10 text-center">
            <Button size="lg">Registra tu Cervecería</Button>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-zinc-500">
        <div className="container  mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Únete a la Revolución de la Cerveza Artesanal con Mash
              </h2>
              <p className="max-w-[600px] mx-auto text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Sé parte de la comunidad de cerveza artesanal de más rápido
                crecimiento en Colombia. ¡Regístrate ahora en Mash y comienza tu
                viaje cervecero!
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <SignInButton>
                <Button size="lg">Crea tu Cuenta en Mash</Button>
              </SignInButton>
              <Button variant="outline" size="lg">
                Explora Cervezas
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
