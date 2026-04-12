const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemonList(limit: number = 20, offset: number = 0) {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Failed to fetch pokemon list');
  }
  return response.json();
}

export async function fetchPokemonDetails(nameOrId: string | number) {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch pokemon details');
  }
  return response.json();
}

export async function fetchPokemonSpecies(name: string) {
  const response = await fetch(`${BASE_URL}/pokemon-species/${name}`);
  if (!response.ok) {
    throw new Error('Failed to fetch pokemon species');
  }
  return response.json();
}
