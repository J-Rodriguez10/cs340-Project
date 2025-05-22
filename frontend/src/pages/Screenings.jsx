import GenericList from "../components/GenericList";

function Screenings() {
  return (
      <div className="page-cont">
          <h1>Screenings</h1>
          <div className="">
              <p>Here you’ll see all scheduled screenings.</p>
                <p>You can add, edit, delete a screening.</p>
              <GenericList endpoint="/screenings" title="Screenings" />
          </div>
      </div>
  );
}

export default Screenings;
