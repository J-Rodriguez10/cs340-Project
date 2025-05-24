import GenericList from "../components/GenericList";

function Tickets() {
  return (
    <div className="page-cont">
      <h1>Tickets</h1>
      <div>
        <span className="page-intro">
          <p>Here you’ll see all purchased tickets.</p>
          <p>You can add, edit, delete a ticket.</p>
        </span>
        <GenericList endpoint="/tickets" title="Tickets" />
      </div>
    </div>
  );
}

export default Tickets;
