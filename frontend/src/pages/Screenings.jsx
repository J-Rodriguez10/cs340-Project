import GenericList from "../components/GenericList";

function Screenings() {
  return (
      <>
          <h1>Screenings</h1>
          <div className="pageDescription">
              <p>Here you’ll see all scheduled screenings.</p>
              <GenericList endpoint="/screenings" title="Screenings" />
          </div>
      </>
  );
}

export default Screenings;
