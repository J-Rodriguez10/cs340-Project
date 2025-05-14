import GenericList from "../components/GenericList";

function Customers() {
  return (
      <>
          <h1>Customers</h1>
          <div className="">
              <p>Here you’ll see your customer list.</p>
              <GenericList endpoint="/customers" title="Customers" />
          </div>
      </>
  );
}

export default Customers;
