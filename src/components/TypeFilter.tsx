import { typeColors, typeTranslations } from '../utils/constants';

interface TypeFilterProps {
  selectedType: string | null;
  onTypeChange: (type: string | null) => void;
}

const types = Object.keys(typeColors);

export function TypeFilter({ selectedType, onTypeChange }: TypeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center p-4">
      <button
        onClick={() => onTypeChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
          selectedType === null
            ? 'bg-white text-gray-900 shadow-lg scale-105'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        Todos
      </button>
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            selectedType === type
              ? 'text-white shadow-lg scale-105'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          style={{
            backgroundColor: selectedType === type ? typeColors[type] : undefined,
          }}
        >
          {typeTranslations[type] || type}
        </button>
      ))}
    </div>
  );
}
