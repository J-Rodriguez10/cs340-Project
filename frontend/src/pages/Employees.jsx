import GenericList from "../components/GenericList";

function Employees() {
  return (
      <div className="page-cont">
          <h1>Employees</h1>
          <div className="">
              <p>Here you’ll see all employees and their roles.</p>
              <GenericList endpoint="/employees" title="Employees" />
          </div>
      </div>
  );
}

export default Employees;
