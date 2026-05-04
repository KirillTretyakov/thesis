import React, { useState } from "react";
import { Column, Row } from "./Flex";
import SelectedResume from "./SelectedResume";
import { MOCK_DATA } from "./mock/mock";
import TopVacancies from "./TopVacancies";
import VacancyDetails from "./VacancyDetails";
import { Metrics } from "./Metrics";
import {FiltersBlock} from "./FiltersBlock";

const ResumePage = () => {
  const [data, setData] = useState(MOCK_DATA);

  return (
    <Row style={{ gap: "24px" }}>
      
      <Column style={{  gap: "32px"  }}>
        <Column style={{ gap: '16px' }}>
          <h2 style={{ margin: 0 }}>Выбранное резюме</h2>
          <SelectedResume
            title={data.selectedResume.title}
            experienceYears={data.selectedResume.experienceYears}
            location={data.selectedResume.location}
            skills={data.selectedResume.skills}
          />
        </Column>

        <Column style={{ gap: '16px' }}>
          <h2 style={{ margin: 0 }}>Топ подходящих вакансий</h2>
          <TopVacancies topVacancies={data.topVacancies} />
        </Column>
      </Column>
      <Column
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: " 0 4px 12px rgba(0, 0, 0, 0.1)",
          border: "1px solid transparent",
          padding: "24px",
        }}
      >
        <h2 style={{ margin: 0 }}>Детали совпадения</h2>
        <VacancyDetails
          title={data.vacancyDetails.title}
          totalScore={data.vacancyDetails.totalScore}
          company={data.vacancyDetails.company}
          city={data.vacancyDetails.city}
          format={data.vacancyDetails.format}
          requiredExperience={data.vacancyDetails.requiredExperience}
          candidateExperience={data.vacancyDetails.candidateExperience}
          skillMatch={data.vacancyDetails.skillMatch}
          allResumeSkills={data.vacancyDetails.allResumeSkills}
        />
      </Column>
    </Row>
  );
};

export default ResumePage;
