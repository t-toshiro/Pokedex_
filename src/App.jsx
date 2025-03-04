import { useEffect, useState } from "react";
import "./App.css";
import { getAllPokemon, getPokemon } from "./utils/pokemon";
import Card from "./components/Card/Card";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextURL, setNextURL] = useState("");
  const [prevURL, setPrevURL] = useState("");

  useEffect(() => {
    const fetchPokemondata = async () => {
      let res = await getAllPokemon(initialURL);
      // console.log(res);
      // console.log(res.results);
      setNextURL(res.next);
      setPrevURL(res.previous);
      loadPokemon(res.results);

      setLoading(false);
    };
    fetchPokemondata();
  }, []);

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        // console.log(pokemon);
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };
  // useEffect(() => {
  //   console.log("Updated pokemonData:", pokemonData);
  // }, [pokemonData]); // pokemonData が変更されるたびに実行される

  const handlePrevPage = async () => {
    setLoading(true);
    let data = await getAllPokemon(prevURL);
    setPrevURL(data.previous);
    setNextURL(data.next);
    await loadPokemon(data.results);
    setLoading(false);
  };

  const handleNextPage = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextURL);
    // console.log(data);
    setPrevURL(data.previous);
    setNextURL(data.next);
    await loadPokemon(data.results);
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="App">
        {loading ? (
          <h1>loading</h1>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />;
              })}
            </div>
            <div className="btn">
              {prevURL && <button onClick={handlePrevPage}>前へ</button>}
              {nextURL && <button onClick={handleNextPage}>次へ</button>}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
