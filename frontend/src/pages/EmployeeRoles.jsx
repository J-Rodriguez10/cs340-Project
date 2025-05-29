import GenericList from "../components/GenericList";

function EmployeeRoles() {
  return (
    <div className="page-cont">
      <h1>Employee Roles</h1>
      <div className="table">
        <span className="page-intro">
          <p>Here you’ll see all available employee roles.</p>
          <p>You can add, edit, delete an employee role.</p>
        </span>
        <GenericList endpoint="/employeeRoles" title="Employee Roles" />
      </div>
    </div>
  );
}

export default EmployeeRoles;
