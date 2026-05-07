const mongoose = require('mongoose');
const technicalQuestionSchema = new mongoose.Schema({
  question:{
    type:String,
    required: [true, "Technical question is required"]
  },
  intention:{
    type:String,
    required:[true, "Intention is required"]
  },

  answer: {
    type:String,
    required:[true, "Answer is required"]
  }
},{
  _id:false
})
const behavioralQuestionSchema = new mongoose.Schema({
 question:{
    type:String,
    required: [true, "Technical question is required"]
  },
  intention:{
    type:String,
    required:[true, "Intention is required"]
  },
  answer: {
    type:String,
    required:[true, "Answer is required"]
  }

},{
_id:false
})

const skillGapSchema = new mongoose.Schema({
  skill:{
    type:String,
    required: [true, "Skill is required"]
  },
  severity:{
    type:String,
    enum: ["low", "medium", "high"],
    required: [true, "Severity is required"]
  }
},{
  _id:false
})
const preparationPlanSchema = new mongoose.Schema({
  day: {
    type:Number,
    required: [true, "Day is required"]
  },
  focus: {
    type:String,
    required: [true, "Focus is required"]
  },
  tasks : [{
    type:String,
    required:[true, "Task is required"]
  }]
})

const interviewReportSchema = new mongoose.Schema({
  jobDescription:{
    type:String,
    required:[true, "job description is required"]
  },
  resume:{
    type:String,
  },
  selfDescription: {
    type:String,
  },
  matchScore: {
    type:Number,
    min:0,
    max:100,
  },
  technicalQuestions : {
    type: [technicalQuestionSchema],
    validate: {
      validator: (questions) => questions.length >= 5,
      message: "At least 5 technical questions are required"
    }
  },
  behavioralQuestions : {
    type: [behavioralQuestionSchema],
    validate: {
      validator: (questions) => questions.length >= 3,
      message: "At least 3 behavioral questions are required"
    }
  },
  skillGaps: {
    type: [skillGapSchema],
    validate: {
      validator: (gaps) => gaps.length >= 2,
      message: "At least 2 skill gaps are required"
    }
  },
  preparationPlan: {
    type: [preparationPlanSchema],
    validate: {
      validator: (days) => days.length >= 5,
      message: "At least 5 preparation plan days are required"
    }
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users"
  },
  title:{
    type:String,
    required:[true, "Job title is required"]
  }
},

{
timestamps:true
})


const interviewReportModel =  mongoose.model("Interview", interviewReportSchema);

module.exports = interviewReportModel;
