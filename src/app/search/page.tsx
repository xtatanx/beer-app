import SearchForm from './_components/search-form';
import SearchResults from './_components/search-results';

export default function Search() {
  // Dummy data for beer results
  const beerResults = [
    {
      id: 1,
      name: 'IPA Dorada',
      brewery: 'Cervecería Artesanal Bogotá',
      style: 'India Pale Ale',
      abv: 6.5,
      ibu: 65,
      rating: 4.2,
      imageUrl: 'https://placehold.co/400x300/FFA500/FFF/jpeg?text=IPA+Dorada',
    },
    {
      id: 2,
      name: 'Stout de Café',
      brewery: 'Cerveza Medellín',
      style: 'Coffee Stout',
      abv: 5.8,
      ibu: 35,
      rating: 4.5,
      imageUrl:
        'https://placehold.co/400x300/8B4513/FFF/jpeg?text=Stout+de+Café',
    },
    {
      id: 3,
      name: 'Lager Criolla',
      brewery: 'Cervezas del Valle',
      style: 'Lager',
      abv: 4.2,
      ibu: 18,
      rating: 3.8,
      imageUrl:
        'https://placehold.co/400x300/FFD700/000/jpeg?text=Lager+Criolla',
    },
    {
      id: 4,
      name: 'Witbier Caribeña',
      brewery: 'Cervecería del Caribe',
      style: 'Witbier',
      abv: 5.0,
      ibu: 15,
      rating: 4.0,
      imageUrl:
        'https://placehold.co/400x300/F0F8FF/000/jpeg?text=Witbier+Caribeña',
    },
    {
      id: 5,
      name: 'Porter Andina',
      brewery: 'Cervezas de los Andes',
      style: 'Porter',
      abv: 5.5,
      ibu: 30,
      rating: 4.3,
      imageUrl:
        'https://placehold.co/400x300/654321/FFF/jpeg?text=Porter+Andina',
    },
    {
      id: 6,
      name: 'Pale Ale Bogotana',
      brewery: 'Cervecería Artesanal Bogotá',
      style: 'American Pale Ale',
      abv: 5.2,
      ibu: 40,
      rating: 4.1,
      imageUrl:
        'https://placehold.co/400x300/DAA520/FFF/jpeg?text=Pale+Ale+Bogotana',
    },
    {
      id: 7,
      name: 'Saison del Valle',
      brewery: 'Cervezas del Valle',
      style: 'Saison',
      abv: 6.0,
      ibu: 25,
      rating: 4.4,
      imageUrl:
        'https://placehold.co/400x300/F4A460/FFF/jpeg?text=Saison+del+Valle',
    },
    {
      id: 8,
      name: 'Amber Ale Cafetera',
      brewery: 'Cerveza Medellín',
      style: 'Amber Ale',
      abv: 5.5,
      ibu: 28,
      rating: 4.0,
      imageUrl:
        'https://placehold.co/400x300/CD853F/FFF/jpeg?text=Amber+Ale+Cafetera',
    },
    {
      id: 9,
      name: 'Hefeweizen Tropical',
      brewery: 'Cervecería del Caribe',
      style: 'Hefeweizen',
      abv: 5.2,
      ibu: 12,
      rating: 4.2,
      imageUrl:
        'https://placehold.co/400x300/F0E68C/000/jpeg?text=Hefeweizen+Tropical',
    },
  ];

  const breweryResults = [
    {
      id: 1,
      name: 'Cervecería Artesanal Bogotá',
      location: 'Bogotá',
      established: 2010,
      rating: 4.3,
      imageUrl:
        'https://placehold.co/400x225/87CEEB/FFF/jpeg?text=Cervecería+Artesanal+Bogotá',
      beerCount: 15,
    },
    {
      id: 2,
      name: 'Cerveza Medellín',
      location: 'Medellín',
      established: 2012,
      rating: 4.6,
      imageUrl:
        'https://placehold.co/400x225/FF69B4/FFF/jpeg?text=Cerveza+Medellín',
      beerCount: 12,
    },
    {
      id: 3,
      name: 'Cervezas del Valle',
      location: 'Cali',
      established: 2015,
      rating: 4.1,
      imageUrl:
        'https://placehold.co/400x225/32CD32/FFF/jpeg?text=Cervezas+del+Valle',
      beerCount: 8,
    },
    {
      id: 4,
      name: 'Cervecería del Caribe',
      location: 'Cartagena',
      established: 2014,
      rating: 4.4,
      imageUrl:
        'https://placehold.co/400x225/FF7F50/FFF/jpeg?text=Cervecería+del+Caribe',
      beerCount: 10,
    },
    {
      id: 5,
      name: 'Cervezas de los Andes',
      location: 'Manizales',
      established: 2013,
      rating: 4.2,
      imageUrl:
        'https://placehold.co/400x225/9370DB/FFF/jpeg?text=Cervezas+de+los+Andes',
      beerCount: 9,
    },
  ];

  return (
    <>
      <section className="w-full py-6 md:py-10 lg:py-12 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <SearchForm></SearchForm>
        </div>
      </section>
      <SearchResults
        beerResults={beerResults}
        breweryResults={breweryResults}
      ></SearchResults>
    </>
  );
}
