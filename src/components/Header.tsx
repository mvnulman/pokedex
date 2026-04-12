import { Search, RefreshCw } from 'lucide-react';

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
}

export function Header({ search, onSearchChange, onRefresh }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-red-600 to-red-700 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-wider">
              Pokédex
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar Pokémon..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all"
              />
            </div>
            
            <button
              onClick={onRefresh}
              className="px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all flex items-center gap-2"
              title="Recarregar"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
