export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  spriteAnimated: string;
  types: string[];
  height: number;
  weight: number;
  abilities: string[];
  stats: Stat[];
  baseExperience: number;
}

export interface Stat {
  name: string;
  value: number;
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonType {
  name: string;
  color: string;
}
