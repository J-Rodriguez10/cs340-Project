import GenericList from "../components/GenericList";

function EmployeeRoles() {
  return (
      <>
          <h1>Employee Roles</h1>
          <div className="">
              <p>Here you’ll see all available employee roles.</p>
                <p>You can add, edit, delete an employee role.</p>
              <GenericList endpoint="/employeeRoles" title="Employee Roles" />
          </div>
      </>
  );
}

export default EmployeeRoles;
