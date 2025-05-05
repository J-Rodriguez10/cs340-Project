import GenericList from "../components/GenericList";

function EmployeeRoles() {
  return (
      <>
          <h1>Employee Roles</h1>
          <div className="pageDescription">
              <p>Here you’ll see all available employee roles.</p>
              <GenericList endpoint="/employeeRoles" title="Employee Roles" />
          </div>
      </>
  );
}

export default EmployeeRoles;
