import { useState, useMemo} from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from './components/Header';
import { TypeFilter } from './components/TypeFilter';
import { PokemonCard } from './components/PokemonCard';
import { PokemonModal } from './components/PokemonModal';
import { Pagination } from './components/Pagination';
import { Pokemon } from './types/pokemon';
import { fetchPokemonList, fetchPokemonDetails } from './services/api';

const TOTAL_POKEMONS = 1025;
const POKEMON_PER_PAGE = 25;

async function loadAllPokemons(): Promise<Pokemon[]> {
  const listData = await fetchPokemonList(TOTAL_POKEMONS, 0);
  const total = listData.results.length;


  const allDetails: Pokemon[] = [];
  const BATCH_SIZE = 50;

  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = listData.results.slice(i, i + BATCH_SIZE);

    const detailsPromises = batch.map((pokemon: { name: string }) =>
      fetchPokemonDetails(pokemon.name)
    );

    const detailsResults = await Promise.all(detailsPromises);

    const mappedBatch: Pokemon[] = detailsResults.map((data) => ({
      id: data.id,
      name: data.name,
      sprite: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default,
      spriteAnimated: data.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default || data.sprites.front_default,
      types: data.types.map((t: { type: { name: string } }) => t.type.name),
      height: data.height,
      weight: data.weight,
      abilities: data.abilities.map((a: { ability: { name: string } }) => a.ability.name),
      stats: data.stats.map((s: { stat: { name: string }; base_stat: number }) => ({
        name: s.stat.name,
        value: s.base_stat,
      })),
      baseExperience: data.base_experience,
    }));

    allDetails.push(...mappedBatch);
  }

  allDetails.sort((a, b) => a.id - b.id);
  return allDetails;
}

function App() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: allPokemons = [], isLoading } = useQuery({
    queryKey: ['pokemons'],
    queryFn: loadAllPokemons,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const filteredPokemons = useMemo(() => {
    let filtered = allPokemons;

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.id.toString() === search ||
        p.id.toString().padStart(3, '0').includes(searchLower)
      );
    }

    if (selectedType) {
      filtered = filtered.filter((p) => p.types.includes(selectedType));
    }

    return filtered;
  }, [search, selectedType, allPokemons]);

  // Paginação sobre os resultados filtrados
  const totalPages = Math.ceil(filteredPokemons.length / POKEMON_PER_PAGE);
  const paginatedPokemons = useMemo(() => {
    const start = (currentPage - 1) * POKEMON_PER_PAGE;
    return filteredPokemons.slice(start, start + POKEMON_PER_PAGE);
  }, [filteredPokemons, currentPage]);

  useMemo(() => {
    setCurrentPage(1);
  }, [search, selectedType]);

  const handleRefresh = () => {
    setSearch('');
    setSelectedType(null);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header
        search={search}
        onSearchChange={setSearch}
        onRefresh={handleRefresh}
      />

      <main className="max-w-7xl mx-auto px-4 pb-12">
        <TypeFilter
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-gray-700 rounded-full"></div>
              <div className="w-24 h-24 border-4 border-red-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="text-gray-400 text-lg">
              Carregando todos os Pokémons...
            </p>
            <p className="text-gray-500 text-sm">
              Aguarde, isso pode levar alguns segundos
            </p>
          </div>
        ) : filteredPokemons.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">
              {search || selectedType
                ? `Nenhum Pokémon encontrado com "${search}"${selectedType ? ` e tipo ${selectedType}` : ''}.`
                : 'Nenhum Pokémon disponível.'}
            </p>
          </div>
        ) : (
          <>
            <div className="py-4 text-center">
              <p className="text-gray-400">
                Mostrando {paginatedPokemons.length} de {filteredPokemons.length} Pokémon
                {search && ` para "${search}"`}
                {selectedType && ` do tipo ${selectedType}`}
                {totalPages > 1 && ` (página ${currentPage} de ${totalPages})`}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-6">
              {paginatedPokemons.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  onClick={() => setSelectedPokemon(pokemon)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </main>

      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </div>
  );
}

export default App;
