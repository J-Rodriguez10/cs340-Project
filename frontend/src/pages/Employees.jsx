import GenericList from "../components/GenericList";

function Employees() {
  return (
      <>
          <h1>Employees</h1>
          <div className="">
              <p>Here you’ll see all employees and their roles.</p>
                <p>You can add, edit, delete an employee.</p>
              <GenericList endpoint="/employees" title="Employees" />
          </div>
      </>
  );
}

export default Employees;
