const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const puppeteer = require("puppeteer")

function getAiClient() {
    if (!process.env.GOOGLE_GENAI_API_KEY) {
        throw new Error("GOOGLE_GENAI_API_KEY is missing from environment variables")
    }

    return new GoogleGenAI({
        apiKey: process.env.GOOGLE_GENAI_API_KEY
    })
}

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).min(5).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).min(3).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).min(2).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).min(5).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const ai = getAiClient()


    const prompt = `Generate an interview report for a candidate with the following details.
                        Do not return empty arrays.
                        Include at least 5 technicalQuestions, 3 behavioralQuestions, 2 skillGaps, and 5 preparationPlan days.
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    let lastError

    for (let attempt = 1; attempt <= 2; attempt++) {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: attempt === 1 ? prompt : `${prompt}
                        Previous response had empty or invalid arrays. Regenerate a complete report with all required arrays filled.`,
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: z.toJSONSchema(interviewReportSchema),
            }
        })

        try {
            return interviewReportSchema.parse(JSON.parse(response.text))
        } catch (error) {
            lastError = error
        }
    }

    throw lastError


}


async function generatePdfFormHtml(htmlContent){
    const browser = await puppeteer.launch();

    try {
        const page = await browser.newPage();

        await page.setContent(htmlContent, { waitUntil: "load" });

        return await page.pdf({ format: "A4",margin:{
            top:"20mm",
            bottom:"20mm",
            left:"15mm",
            right:"15mm"

        } 
    });
    } finally {
        await browser.close();
    }
}


async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const ai = getAiClient()
    const resumepdfSchema = z.object({
        html: z.string()
    });

    const prompt = `Generate HTML resume for a candidate:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema(resumepdfSchema)
        }
    });

    const jsonContent = resumepdfSchema.parse(JSON.parse(response.text));

    const pdfBuffer = await generatePdfFormHtml(jsonContent.html);

    return pdfBuffer;
}







module.exports =  {generateInterviewReport,generateResumePdf}
