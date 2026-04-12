import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from './components/Header';
import { TypeFilter } from './components/TypeFilter';
import { PokemonCard } from './components/PokemonCard';
import { PokemonModal } from './components/PokemonModal';
import { Pagination } from './components/Pagination';
import { Pokemon } from './types/pokemon';
import { fetchPokemonList, fetchPokemonDetails, fetchPokemonNamesByType } from './services/api';

const TOTAL_POKEMONS = 1025;
const POKEMON_PER_PAGE = 25;

interface PokemonIndexItem {
  id: number;
  name: string;
}

function parsePokemonIdFromUrl(url: string): number {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}

function mapPokemonData(data: any): Pokemon {
  return {
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
  };
}

function App() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: pokemonIndex = [], isLoading: isIndexLoading } = useQuery<PokemonIndexItem[]>({
    queryKey: ['pokemon-index'],
    queryFn: async () => {
      const listData = await fetchPokemonList(TOTAL_POKEMONS, 0);

      return listData.results
        .map((pokemon: { name: string; url: string }) => ({
          id: parsePokemonIdFromUrl(pokemon.url),
          name: pokemon.name,
        }))
        .filter((pokemon: PokemonIndexItem) => pokemon.id > 0)
        .sort((a: PokemonIndexItem, b: PokemonIndexItem) => a.id - b.id);
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 30,
  });

  const { data: typePokemons = [], isLoading: isTypeLoading } = useQuery<PokemonIndexItem[]>({
    queryKey: ['pokemon-by-type', selectedType],
    queryFn: async () => {
      if (!selectedType) {
        return [];
      }

      return fetchPokemonNamesByType(selectedType);
    },
    enabled: Boolean(selectedType),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 30,
  });

  const filteredPokemonRefs = useMemo(() => {
    let filtered = pokemonIndex;

    if (selectedType) {
      const typeNames = new Set(typePokemons.map((pokemon) => pokemon.name));
      filtered = filtered.filter((pokemon) => typeNames.has(pokemon.name));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.id.toString() === search ||
        p.id.toString().padStart(3, '0').includes(searchLower)
      );
    }

    return filtered;
  }, [search, selectedType, pokemonIndex, typePokemons]);

  const totalPages = Math.max(1, Math.ceil(filteredPokemonRefs.length / POKEMON_PER_PAGE));

  const paginatedPokemonRefs = useMemo(() => {
    const start = (currentPage - 1) * POKEMON_PER_PAGE;
    return filteredPokemonRefs.slice(start, start + POKEMON_PER_PAGE);
  }, [filteredPokemonRefs, currentPage]);

  const { data: paginatedPokemons = [], isLoading: isPageLoading } = useQuery<Pokemon[]>({
    queryKey: ['pokemon-page', paginatedPokemonRefs.map((pokemon) => pokemon.name).join(',')],
    queryFn: async () => {
      const detailsResults = await Promise.all(
        paginatedPokemonRefs.map((pokemon) => fetchPokemonDetails(pokemon.name))
      );

      return detailsResults.map(mapPokemonData).sort((a, b) => a.id - b.id);
    },
    enabled: paginatedPokemonRefs.length > 0,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedType]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleRefresh = () => {
    setSearch('');
    setSelectedType(null);
    setCurrentPage(1);
  };

  const isLoading = isIndexLoading || isTypeLoading || isPageLoading;

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
              Carregando Pokémons...
            </p>
            <p className="text-gray-500 text-sm">
              Carregando apenas os dados da página atual
            </p>
          </div>
        ) : filteredPokemonRefs.length === 0 ? (
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
                Mostrando {paginatedPokemons.length} de {filteredPokemonRefs.length} Pokémon
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
