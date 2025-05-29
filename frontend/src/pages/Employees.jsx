import GenericList from "../components/GenericList";

function Employees() {
  return (
    <div className="page-cont">
      <h1>Employees</h1>
      <div>
        <span className="page-intro">
          <p>Here you’ll see all employees and their roles.</p>
          <p>You can add, edit, delete an employee.</p>
        </span>
        <GenericList endpoint="/employees" title="Employees" />
      </div>
    </div>
  );
}

export default Employees;
