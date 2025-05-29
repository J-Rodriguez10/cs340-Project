import GenericList from "../components/GenericList";

function Customers() {
  return (
    <div className="page-cont">
      <h1>Customers</h1>
      <div>
        <span className="page-intro">
          <p>Here you’ll see your customers.</p>
          <p>You can add, edit, and delete the information of customers.</p>
        </span>
        <GenericList endpoint="/customers" title="Customers" />
      </div>
    </div>
  );
}

export default Customers;
