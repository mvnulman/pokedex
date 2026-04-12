import { typeColors, typeTranslations, formatPokemonId } from '../utils/constants';
import { Pokemon } from '../types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
}

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const mainType = pokemon.types[0];
  const bgColor = typeColors[mainType] || '#A8A878';

  return (
    <button
      onClick={onClick}
      className="group relative bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 animate-fade-in"
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
        style={{ background: `linear-gradient(135deg, ${bgColor}, transparent)` }}
      />
      
      {/* Card content */}
      <div className="relative p-4">
        {/* Pokemon number */}
        <span className="text-xs font-bold text-gray-400">
          {formatPokemonId(pokemon.id)}
        </span>

        {/* Pokemon image */}
        <div className="flex justify-center py-4">
          <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <img
              src={pokemon.spriteAnimated || pokemon.sprite}
              alt={pokemon.name}
              className="w-20 h-20 object-contain"
              loading="lazy"
            />
          </div>
        </div>

        <h3 className="text-center text-lg font-bold text-white capitalize mb-3">
          {pokemon.name}
        </h3>

        <div className="flex gap-2 justify-center flex-wrap">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className="px-3 py-1 rounded-full text-xs font-semibold text-white capitalize"
              style={{ backgroundColor: typeColors[type] }}
            >
              {typeTranslations[type] || type}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
