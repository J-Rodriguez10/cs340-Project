import GenericList from "../components/GenericList";

function Movies() {
  return (
      <div className="page-cont">
          <h1>Movies</h1>
          <div className="">
              <p>Here you’ll see a list of all movies from the database.</p>
              <GenericList endpoint="/movies" title="Movies" />
          </div>
      </div>
  );
}

export default Movies;
