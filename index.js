import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PokemonApp() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 8; // items per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const offset = (page - 1) * limit;
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
        );

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();

        // Fetch Pokémon details (images etc.)
        const details = await Promise.all(
          data.results.map(async (poke) => {
            const res = await fetch(poke.url);
            return res.json();
          })
        );

        setPokemons(details);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Pokémon Gallery</h1>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pokemons.map((poke) => (
              <Card key={poke.id} className="shadow-lg rounded-2xl">
                <CardContent className="flex flex-col items-center p-4">
                  <img
                    src={poke.sprites.front_default}
                    alt={poke.name}
                    className="w-20 h-20 mb-2"
                  />
                  <h2 className="text-lg font-semibold capitalize">
                    {poke.name}
                  </h2>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-6">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-lg">Page {page}</span>
            <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </>
      )}
    </div>
  );
}
