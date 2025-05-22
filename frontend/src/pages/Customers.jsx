import GenericList from "../components/GenericList";

function Customers() {
  return (
      <div className="page-cont">
          <h1>Customers</h1>
          <div className="">
              <p>Here you’ll see your customer </p>
                <p>You can add, edit, and delete the information of customers.</p>
              <GenericList endpoint="/customers" title="Customers" />
          </div>
      </div>
  );
}

export default Customers;
