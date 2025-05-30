function GenericListHeader({ title }) {
  const colorMap = {
    Customers: '#63e6e2',//Cyan 
    Employees: '#ff6ec7',//Pink
    "Employee Roles" : '#c792ea',//Purple
    Movies: '#f9e900',//Yellow
    Screenings: '#ff5f5f',//Red
    Tickets: '#9eff6e',//Green
  };

  // Default to Cyan if none of the titles match.
  const headerColor = colorMap[title] || 'var(--text-cyan)';

  return (
    <h2
      className="entity-header"
      style={{color: headerColor}}>
         {title}
    </h2>
  );
}

export default GenericListHeader;
