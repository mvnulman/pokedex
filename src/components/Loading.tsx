import { Loader2 } from 'lucide-react';

export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
      <p className="text-gray-400 text-lg">Carregando Pokémons...</p>
    </div>
  );
}
