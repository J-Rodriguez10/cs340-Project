import HomeCard from "../components/HomeCard";
import { downloadFile } from "../helper/downloadFilesHelper";


function Home() {
  return (
    <div className="page-cont">
      <h1>CS 340 – Oregon State University DBMS Project</h1>
      <p className="subtitle">
        Created by <a href="https://github.com/J-Rodriguez10" className="highlight-name" target="_blank" rel="noopener noreferrer">Jesus Rodriguez</a> and <a href="<PLACE YOUR GITHUB URL HERE>" className="highlight-name" target="_blank" rel="noopener noreferrer">Julio Jimenez</a> to demonstrate core concepts of relational databases and SQL.
      </p>

      {/* 2 x 2 Grid container: */}
      <div className="home-card-grid">
        <HomeCard
          title="ER Diagram"
          description="Visual representation of entities and relationships within the CinePictures database."
          // Direct access with no public
          imageSrc="/images/erd.png"
          imageAlt="ER Diagram preview"
          variant="blue"
          onDownloadClick={() => downloadFile("/files/ERD.png", "ERD.png")}
          
        />

        <HomeCard
          title="Database Schema"
          description="The structural blueprint of all tables, columns, and relationships used in CinePictures."
          imageSrc="/images/database-schema.png"
          imageAlt="Database Schema preview"
          variant="black"
          onDownloadClick={() => downloadFile("/files/database-schema.png", "Database_Schema.png")}
        />

        <HomeCard
          title="DDL & DML Scripts"
          description="SQL scripts that perform all data operations for the CinePictures system."
          imageSrc="/images/sql-preview.png"
          imageAlt="DDL and DML Scripts preview"
          variant="black"
          onDownloadClick={() => downloadFile("/files/cinepictures-sql-scripts.zip", "CinePictures_SQL_Scripts.zip")}
        />

        <HomeCard
          title="Project Report"
          description="Final report detailing the database's development process."
          imageSrc="/images/report-preview.png"
          imageAlt="Project Report preview"
          variant="blue"
          onDownloadClick={() => downloadFile("/files/project-report.pdf", "Project_Report.pdf")}
        />
      </div>
    </div>
  );
}

export default Home;
