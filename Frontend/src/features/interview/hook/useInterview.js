import {getAllInterviewReports,generateInterviewReport, getInterviewReportById, downloadResumePdf} from "../services/interview.api"
import {useContext} from "react"

import { InterviewContext } from "../interviewcontext"




export const useInterview = () =>{

  const context = useContext(InterviewContext)

  if(!context){
    throw new Error("useInterview must be used within an InterviewProvider")
  }
  const {loading, setLoading, report, setReport, reports, setReports} = context

  const generateReport = async ({jobDescription, selfDescription, resumeFile}) => {
    setLoading(true)
    let response = null
    try{
      const response = await generateInterviewReport({jobDescription, selfDescription, resumeFile })
      setReport(response.interviewReport)
      return response.interviewReport
    }catch(error){
console.log(error)
      throw error
    }finally{
      setLoading(false)
    }
    return response.interviewReport
  }

const getReportById = async (interviewId) =>{
  setLoading(true)
  try{
    const response = await getInterviewReportById(interviewId)
    setReport(response.interviewReport)
  } catch(error){
    console.log(error)
  } finally{
    setLoading(false)
  }
}

const getReports = async() => {
  setLoading(true)
  let response = null
  try{
     response = await getAllInterviewReports()
    setReports(response.interviewReports)
  } catch(error){
    console.log(error)
  } finally{
    setLoading(false)
  }
  response.interviewReports
}

const downloadResume = async(interviewReportId) => {
  setLoading(true)

  try {
    const pdfBlob = await downloadResumePdf(interviewReportId)
    const url = window.URL.createObjectURL(pdfBlob)
    const link = document.createElement("a")

    link.href = url
    link.download = `resume_${interviewReportId}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch(error) {
    console.log(error)
    throw error
  } finally {
    setLoading(false)
  }
}


return {loading, report, reports, generateReport, getReportById, getReports, downloadResume}
}
