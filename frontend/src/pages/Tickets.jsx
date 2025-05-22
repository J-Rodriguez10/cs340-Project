import GenericList from "../components/GenericList";

function Tickets() {
  return (
      <div className="page-cont">
          <h1>Tickets</h1>
          <div className="">
              <p>Here you’ll see all purchased tickets.</p>
              <GenericList endpoint="/tickets" title="Tickets" />
          </div>
      </div>
  );
}

export default Tickets;
