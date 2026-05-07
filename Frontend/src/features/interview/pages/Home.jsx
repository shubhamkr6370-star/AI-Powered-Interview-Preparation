import React,{useState, useRef} from "react";
import heroArtwork from "../../../assets/hero.png";
import "../style/home.scss";
import {useInterview} from '../hook/useInterview.js'
import {useNavigate} from 'react-router-dom'

const Home = () => {
  const {loading, generateReport} = useInterview()
  const navigate = useNavigate()

const[jobDescription, setJobdescription] = useState("")
const [selfDescription, setSelfDescription] = useState("")
const [resumeFileName, setResumeFileName] = useState("")
const [error, setError] = useState("")
const resumeInputRef = useRef()

const handleGenerateReport = async () => {
  const resumeFile = resumeInputRef.current?.files?.[0]

  if (!jobDescription.trim() || !selfDescription.trim() || !resumeFile) {
    setError("Please add the job description, self description, and resume PDF before generating.")
    return
  }

  setError("")

  try {
    const data= await generateReport({jobDescription, selfDescription, resumeFile})
    if (data?._id) {
      navigate(`/interview/${data._id}`)
      return
    }

    setError("The report was generated, but no report id was returned.")
  } catch (err) {
    setError(err?.response?.data?.message || "Could not generate the interview report. Please try again.")
  }
}

if(loading){
  return (
    <main className='loading-screen'>
      <h1>Loading your interview plan...</h1>

    </main>
  )
}
const focusAreas = ["Behavioral", "System design", "Role fit"];



  return (
    <main className="home">
      <section className="home-shell" aria-labelledby="interview-title">
        <aside className="home-hero" aria-label="Interview preparation summary">
          <div className="brand-row">
            <span className="brand-mark">AI</span>
            <span>Interview Studio</span>
          </div>

          <div className="hero-copy">
            <p className="eyebrow">Practice session builder</p>
            <h1 id="interview-title">Create a focused interview from your role details.</h1>
            <p>
              Add the job description, resume, and your context to prepare a
              tailored interview report.
            </p>
          </div>

          <div className="hero-artwork" aria-hidden="true">
            <img src={heroArtwork} alt="" />
          </div>

          <div className="metric-grid">
            <div>
              <strong>30 min</strong>
              <span>Session plan</span>
            </div>
            <div>
              <strong>12+</strong>
              <span>Question cues</span>
            </div>
          </div>
        </aside>

        <div className="interview-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Input details</p>
              <h2>Generate interview report</h2>
            </div>
            <span className="status-pill">Draft</span>
          </div>

          <div className="interview-input-group">
            <div className="left">
              <label htmlFor="jobDescription">Job Description</label>
              <textarea
              onChange ={(e) =>{setJobdescription(e.target.value)}}
                name="jobDescription"
                id="jobDescription"
                placeholder="Paste the job description, responsibilities, required skills, and company expectations..."
              />
            </div>

            <div className="right">
              <div className="input-group upload-group">
                <div>
                  <label htmlFor="resume">Resume</label>
                  <small className="highlight">Use with job description</small>
                </div>
                <label className="file-label" htmlFor="resume">
                  <span>{resumeFileName || "Upload PDF"}</span>
                  <span className="file-note">Max 10 MB</span>
                </label>
                <input
                  ref={resumeInputRef}
                  hidden
                  type="file"
                  name="resume"
                  id="resume"
                  accept=".pdf"
                  onChange={(e) => {
                    setResumeFileName(e.target.files?.[0]?.name || "")
                    setError("")
                  }}
                />
              </div>

              <div className="input-group">
                <label htmlFor="selfDescription">Self Description</label>
                <textarea
                onChange = {(e) =>{setSelfDescription(e.target.value)}}
                  name="selfDescription"
                  id="selfDescription"
                  placeholder="Add your background, target role, strengths, gaps, or interview goals..."
                />
              </div>

              <div className="focus-card" aria-label="Interview focus areas">
                <span>Focus areas</span>
                <div>
                  {focusAreas.map((area) => (
                    <button type="button" key={area}>
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="form-error" role="alert">{error}</p>}

              <button onClick={handleGenerateReport} className="button primary-button" type="button" disabled={loading}>
                {loading ? "Loading your interview plan..." : "Generate Interview Report"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;


