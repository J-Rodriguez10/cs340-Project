import GenericList from "../components/GenericList";

function Movies() {
  return (
      <>
          <h1>Movies</h1>
          <div className="">
              <p>Here you’ll see a list of all movies from the database.</p>
              <GenericList endpoint="/movies" title="Movies" />
          </div>
      </>
  );
}

export default Movies;
