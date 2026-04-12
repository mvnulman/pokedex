import { X, Ruler, Weight, Zap } from 'lucide-react';
import { Pokemon } from '../types/pokemon';
import { typeColors, typeTranslations, statTranslations, formatPokemonId, formatHeight, formatWeight } from '../utils/constants';

interface PokemonModalProps {
  pokemon: Pokemon;
  onClose: () => void;
}

export function PokemonModal({ pokemon, onClose }: PokemonModalProps) {
  const mainType = pokemon.types[0];
  const bgColor = typeColors[mainType] || '#A8A878';

  const getMaxStat = () => {
    return Math.max(...pokemon.stats.map(s => s.value), 100);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >

        <div 
          className="relative p-6 rounded-t-3xl"
          style={{ background: `linear-gradient(135deg, ${bgColor}40, ${bgColor}20)` }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-gray-900/50 rounded-full hover:bg-gray-900 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="flex items-center gap-6">

            <div className="w-40 h-40 bg-gray-800/50 rounded-full flex items-center justify-center animate-pulse-slow">
              <img
                src={pokemon.spriteAnimated || pokemon.sprite}
                alt={pokemon.name}
                className="w-36 h-36 object-contain"
              />
            </div>


            <div className="flex-1">
              <span className="text-sm text-gray-400 font-bold">
                {formatPokemonId(pokemon.id)}
              </span>
              <h2 className="text-3xl font-bold text-white capitalize mb-3">
                {pokemon.name}
              </h2>
              

              <div className="flex gap-2 mb-4">
                {pokemon.types.map((type) => (
                  <span
                    key={type}
                    className="px-4 py-2 rounded-full text-sm font-semibold text-white capitalize"
                    style={{ backgroundColor: typeColors[type] }}
                  >
                    {typeTranslations[type] || type}
                  </span>
                ))}
              </div>


              <div className="flex gap-3">
                <div className="bg-gray-900/60 rounded-xl p-3 flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-400">Altura</p>
                    <p className="text-sm font-bold text-white">{formatHeight(pokemon.height)}</p>
                  </div>
                </div>
                <div className="bg-gray-900/60 rounded-xl p-3 flex items-center gap-2">
                  <Weight className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-xs text-gray-400">Peso</p>
                    <p className="text-sm font-bold text-white">{formatWeight(pokemon.weight)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            Estatísticas Base
          </h3>
          
          <div className="space-y-3">
            {pokemon.stats.map((stat) => (
              <div key={stat.name} className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-28">
                  {statTranslations[stat.name] || stat.name}
                </span>
                <span className="text-sm font-bold text-white w-10">
                  {stat.value}
                </span>
                <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(stat.value / getMaxStat()) * 100}%`,
                      backgroundColor: bgColor 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>


        <div className="p-6 pt-0">
          <h3 className="text-xl font-bold text-white mb-4">
            Habilidades
          </h3>
          <div className="flex flex-wrap gap-2">
            {pokemon.abilities.map((ability) => (
              <span
                key={ability}
                className="px-4 py-2 bg-gray-800 rounded-lg text-sm text-gray-300 capitalize"
              >
                {ability.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </div>


        <div className="p-6 pt-0">
          <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-xl p-4">
            <p className="text-sm text-gray-400">Experiência Base</p>
            <p className="text-2xl font-bold text-yellow-400">{pokemon.baseExperience} XP</p>
          </div>
        </div>
      </div>
    </div>
  );
}
