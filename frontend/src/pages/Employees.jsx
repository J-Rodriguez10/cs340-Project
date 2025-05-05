import GenericList from "../components/GenericList";

function Employees() {
  return (
      <>
          <h1>Employees</h1>
          <div className="pageDescription">
              <p>Here you’ll see all employees and their roles.</p>
              <GenericList endpoint="/employees" title="Employees" />
          </div>
      </>
  );
}

export default Employees;
