import GenericList from "../components/GenericList";

function Movies() {
  return (
    <div className="page-cont">
      <h1>Movies</h1>
      <div>
        <span className="page-intro">
          <p>Here you’ll see a list of all movies from the database.</p>
          <p>You can add a new movie or edit an existing one.</p>
        </span>
        <GenericList endpoint="/movies" title="Movies" />
      </div>
    </div>
  );
}

export default Movies;
