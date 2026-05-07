import React, { useState,useEffect } from "react";
import "../style/interview.scss";

 import {useInterview} from '../hook/useInterview.js'
 import { useParams } from "react-router-dom";

const reportSections = [
  {
    id: "technical",
    label: "Technical questions",
  },
  {
    id: "behavioral",
    label: "Behavioral questions",
  },
  {
    id: "roadmap",
    label: "Road Map",
  },
];

const Interview = () => {
  const [activeSection, setActiveSection] = useState("technical");
  const {loading, report, getReportById, downloadResume} = useInterview()
  const {interviewId} = useParams()


  useEffect (() =>{
    if(interviewId){
      getReportById(interviewId)
    }

  }, [interviewId])

  const handleDownloadResume = async () => {
    if (!interviewId || loading) {
      return
    }

    await downloadResume(interviewId)
  }

  const activeSectionLabel = reportSections.find(
    (section) => section.id === activeSection
  )?.label;
  const technicalQuestions = report?.technicalQuestions || []
  const behavioralQuestions = report?.behavioralQuestions || []
  const roadMap = report?.preparationPlan || []
  const skillGaps = report?.skillGaps || []

  return (
    <main className="interview-report">
      <section className="report-shell" aria-label="Interview report">
        <aside className="report-sidebar" aria-label="Report sections">
          <div className="sections-menu">
            <p>Sections</p>

            <nav>
              {reportSections.map((section) => (
                <button
                  type="button"
                  key={section.id}
                  className={activeSection === section.id ? "active" : ""}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.label}
                </button>
              ))}
            </nav>

            <button
              type="button"
              className="download-resume-button"
              onClick={handleDownloadResume}
              disabled={loading || !report}
            >
              Download Resume
            </button>
          </div>
        </aside>

        <section className="report-content" aria-label="Selected report content">
          <div className="content-header">
            <p>Interview report</p>
            <div className="header-title">
              <h1>{activeSectionLabel}</h1>
              {typeof report?.matchScore === "number" && (
                <span className="match-score">{report.matchScore}% Match</span>
              )}
            </div>
          </div>

          {loading && !report && (
            <div className="empty-state">
              <p>Loading your interview report...</p>
            </div>
          )}

          {activeSection === "technical" && (
            <div className="question-section">
              <h2>Technical Questions</h2>
              {technicalQuestions.length > 0 ? (
                <div className="question-list">
                  {technicalQuestions.map((item, index) => (
                    <article key={`${item.question}-${index}`} className="question-card">
                      <span>Q{index + 1}</span>
                      <div>
                        <h3>{item.question}</h3>
                        <p>{item.intention}</p>
                        <details>
                          <summary>View answer</summary>
                          <p>{item.answer}</p>
                        </details>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p>No technical questions found for this report.</p>
              )}
            </div>
          )}

          {activeSection === "behavioral" && (
            <div className="question-section">
              <h2>Behavioral Questions</h2>
              {behavioralQuestions.length > 0 ? (
                <div className="question-list">
                  {behavioralQuestions.map((item, index) => (
                    <article key={`${item.question}-${index}`} className="question-card">
                      <span>Q{index + 1}</span>
                      <div>
                        <h3>{item.question}</h3>
                        <p>{item.intention}</p>
                        <details>
                          <summary>View answer</summary>
                          <p>{item.answer}</p>
                        </details>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p>No behavioral questions found for this report.</p>
              )}
            </div>
          )}

          {activeSection === "roadmap" && (
            <div className="question-section">
              <h2>Road Map</h2>
              {roadMap.length > 0 ? (
                <div className="roadmap-list">
                  {roadMap.map((step, index) => (
                    <article key={`${step.day}-${step.focus}-${index}`}>
                      <span>{step.day || index + 1}</span>
                      <div>
                        <h3>{step.focus}</h3>
                        <ul>
                          {(step.tasks || []).map((task) => (
                            <li key={task}>{task}</li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p>No roadmap found for this report.</p>
              )}
            </div>
          )}
        </section>

        <aside className="skill-gap-panel" aria-label="Skill gaps">
          <div className="side-panel-header">
            <h2>Skill Gaps</h2>
            {typeof report?.matchScore === "number" && (
              <span>{report.matchScore}% Match</span>
            )}
          </div>

          <div className="skill-list">
            {skillGaps.length > 0 ? (
              skillGaps.map((gap, index) => (
                <span key={`${gap.skill}-${index}`} className={gap.severity}>
                  <strong>{gap.skill}</strong>
                  <small>{gap.severity}</small>
                </span>
              ))
            ) : (
              <p>No skill gaps found.</p>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Interview;
