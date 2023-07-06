import { call, put, takeEvery, all, fork, takeLatest } from "redux-saga/effects"
// Crypto Redux States
import { GET_CHARTS_DATA } from "./actionTypes"
import { apiSuccess, apiFail } from "./actions"
import _ from "lodash"
import { createReferralCreators, createReferralTypes } from "./reducer"
import FileDownload from "js-file-download"
import { saveAs } from "file-saver"
import { v4 as uuid } from "uuid";


const {
  REQUEST_INCOMPLETE_CASE,
  GET_SUBSCRIPTIONS,
  GET_AVAILABLE_PATHWAYS,
  GET_INJURY_QUESTIONS,
  CREATE_CASE,
  SUBMIT_INJURY_SUMMARY,
  REQUEST_LEAFLETS,
  SUBMIT_CONSENT_AND_IMAGES,
  REQUEST_ON_CALL_REGISTRAR_DETAILS,
  SUBMIT_CASE_AT_ENDPOINT,
  SEND_LEAFLETS,
  REQUEST_FEEDBACK_QNA,
  SUBMIT_VISUAL_ACUITY,
  GET_DRUGS,
  REQUEST_PATIENT_DATA,
  SEND_UNKNOWN_DRUG_EMAIL,
  SAVE_MID_RESPONSE,
  GET_REAU_SCREENS,
  REQUEST_REAU_NEXT_ID,
  REQUEST_CASE_PDF,
  REQUEST_CASE_PDF_DETAILS,
  REQUEST_CASE_CANCEL,
  SEARCH_PATIENT_DATA,
  SAVE_CONTACT_DATA,
  UPDATE_CONTACTED,
  FIND_LOCAL_HOSPITAL
} = createReferralTypes

import {
  getPathwaysBySpecialityFlag,
  postCreateCase,
  getQuestions,
  getSummaryLeaflets,
  putSubmitCase,
  postCaseConsent,
  getImageUrls,
  uploadImage,
  getDecisionScreenDetails,
  getOnCall,
  createReferral,
  caseContacted,
  submitLeafletsApi,
  subscriptionDataGet,
  getOneCase,
  getFeedbackqna,
  uploadVisual,
  getDrugs,
  getPatientFormdata,
  ophthalmologyRequestSignedUrls,
  drugNotFound,
  putMidResponse,
  getNewDecisionScreen,
  updateCaseStatus,
  getReauScreenFields,
  getRheuNextQuestionId,
  requestCasePdfDownload,
  rheumatalogyRequestSignedUrls,
  rheumatalogyMidRequestSignedUrls,
  setCaseCanceled,
  getPimsPathway,
  getPDSSearch,
  saveContactedData,
  findLocalHospitalBMEC
} from "servicies/UserServicies"
import { file } from "@babel/types"
import { appCreators } from "store/app/appReducer"
import { showToast } from "utils/toastnotify"
import moment from "moment"
import axios from "axios"
import {
  getrheu2FileFields,
  getrheu3FileFields,
} from "helpers/createReferral.js"

let s3urls

const findQuestionBasedOnId = (id,questions) => {

  let currentQuestion ="";
  currentQuestion = questions.filter(q=>q.id === id);
  return currentQuestion[0];
}


async function getRheuImages(images){
  const {rheuInves2,rheuInves3} = images;
  debugger;


  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }


 try{
      if(Object.keys(rheuInves2)?.length>0){
          await Promise.all(Object.keys(rheuInves2).map(async(fieldName)=>{
              await Promise.all(rheuInves2[fieldName]?.map(async(url,index)=>{
                  const res = await fetch(url);
                  const blob = await res.blob()
                  const objurl = URL.createObjectURL(blob);
                  const contentType = res.headers.get('content-type')
                  const fileType = blob?.type?.split("/")[1];
                  const file = new File([blob], `${index}`, { contentType })
                  console.log(file,"file");
                  Object.assign(file,{
                    preview: file.preview ? file.preview : URL.createObjectURL(file),
                    formattedSize:formatBytes(file.size),
                })
                  // let metadata = {
                  //   type: blob.type,
                  //   ...blob
                  // };
                  // let file = new File([blob],index, metadata);
                  rheuInves2[fieldName][index] = { file, type: blob.type,id:uuid() }
              }))
          }))
      }
      if(Object.keys(rheuInves3)?.length>0){
          await Promise.all(Object.keys(rheuInves3).map(async (fieldName)=>{
              await Promise.all(rheuInves3[fieldName]?.map(async(url,index)=>{
                  const res = await fetch(url);
                  const blob = await res.blob()
                  const objurl = URL.createObjectURL(blob)
                  const contentType = res.headers.get('content-type')
                  const fileType = blob?.type?.split("/")[1];
                  const file = new File([blob], `${index}`, { contentType })
                  Object.assign(file,{
                    preview: file.preview ? file.preview : URL.createObjectURL(file),
                    formattedSize:formatBytes(file.size),
                })
                  rheuInves3[fieldName][index] = {file, type: blob.type,id:uuid()} 
              }))
          }))
      }
      return {rheuInves2,rheuInves3}
     
 }
 catch(err){
     console.log(err);
 }
 
}

async function getImages(images) {
  // debugger;
  try {
    if (Array.isArray(images)) {
      let ret = Promise.all(
        images.map(async url => {
          const res = await fetch(url)
          const blob = await res.blob()
          //const objurl = URL.createObjectURL(blob)
          return { src: blob, type: blob.type }
        })
      )
      let re = await ret.then(ret => {
        console.log(ret)
        return ret
      })
      return re
    } else {

      let re;
      let le;
      let leftEye = [];
      let rightEye = [];
      if(images?.rightEye?.length>0) {
         re = Promise.all(
          images?.rightEye?.map(async url => {
            const res = await fetch(url.url)
            const blob = await res.blob()
            //const objurl = URL.createObjectURL(blob)
            return { src: blob, type: blob.type, exam: url.type }
          })
        )
      rightEye = await re.then(ret => {
        return ret
      })
      }
      if(images?.leftEye?.length>0) {
        le = Promise.all(
          images?.leftEye?.map(async url => {
            const res = await fetch(url.url)
            const blob = await res.blob()
            //const objurl = URL.createObjectURL(blob)
            return { src: blob, type: blob.type, exam: url.type }
          })
        )
        leftEye = await le.then(ret => {
          return ret
        })
      }
      return { leftEye, rightEye }
    }
  } catch (err) {
    console.error(err)
  }
}

export function* getSubscriptions(action) {
  const response = yield call(subscriptionDataGet)
  console.log(response)
  if (response.ok) {
    let subscriptions = []
    response.data.map(item => {
      return subscriptions.push({
        label: item.organisation.name,
        value: item.organisation._id,
        options: item.specialities.map(i => {
          return {
            label: i.name,
            receivingOrganisationID: item.organisation._id,
            receivingSpecialityID: i._id,
            flag: item.organisation.orgCode + i.code,
            value: item.organisation.orgCode + i.code,
          }
        }),
      })
    })
    subscriptions.map(item => {
      item.options.reverse()
    })
    console.log(subscriptions)
    yield put(createReferralCreators.successSubscriptions(subscriptions))
  } else {
    showToast(response.error, "error")
  }
}

export function* getAvailablePathways(action) {
  console.log("get available pathways saga called:", action)
  try {
    const flag = action.speciality.flag
    const response = yield call(getPathwaysBySpecialityFlag, flag)
    console.log(response)

    if (response.ok) {
      console.log(response.data)
      yield put(
        createReferralCreators.successAvailablePathways(response.data.pathway)
      )
      yield put(createReferralCreators.setTabIndex("2"))
    } else {
      if (response.error === "Expired or invalid token - please log in again") {
        yield put(appCreators.clearToken())
        showToast(response.error, "error")
      }

      console.log(response.data)
    }
    return response.data.pathway
  } catch (e) {
    console.log(e)
  }
}

export function* createCase(action) {
  console.log("Create case:", action)
  const {
    speciality,
    patientInfo,
    parentInfo,
    orgID,
    isTransmittable,
    covid,
    childProtectionConcern,
  } = action
  debugger
  console.log(speciality.value)
  console.log(action)
  console.log(patientInfo)
  console.log(parentInfo)
  const payload = {
    GPmcode: patientInfo.GPmcode,
    firstName: patientInfo.firstName,
    lastName: patientInfo.lastName,
    dateOfBirth: patientInfo.dateOfBirth,
    NHSNumber: patientInfo.nhsNumber,
    hospitalNumber: patientInfo.hospitalNumber,
    transmittableDisease: isTransmittable,
    covid19: covid || "0",
    gender: patientInfo.gender.toLowerCase(),
    isGDPR: true,
    parent: {
      firstName: parentInfo.parentFirstName,
      lastName: parentInfo.parentLastName,
      contactNumber: parentInfo.parentPhoneNumber,
      emailAddress: parentInfo.parentEmailAddress,
    },
    specialitySelected: speciality.label,
    receivingOrganisationID: speciality.receivingOrganisationID,
    receivingSpecialityID: speciality.receivingSpecialityID,
    flag: speciality.flag,
    practiseID: orgID,
    childProtection: childProtectionConcern === "yes",
    currentTab: "3",
    gpFirstName: patientInfo.GPName,
    gpLastName: '',
    gpEmailAddress: patientInfo.GPEmailAddress,
    gpPhoneNumber: patientInfo.GPPhoneNumber,
    postCode: patientInfo.postCode,
    patientAddress: patientInfo.patientAddress,
    gpStoreAddress: patientInfo.GPAddress
  }
  const response = yield call(postCreateCase, payload)
  console.log("RESPONSE\n", response)
  if (response.ok) {
    yield put(createReferralCreators.successCreateCase(response.data))

    yield put(createReferralCreators.setTabIndex("3"))
    //showNotification(response.data.message, NOTIFICATION_TYPE.SUCCESS);
    showToast(response.data.message, "success")
    console.log(response.data.message)
  } else {
    if (
      response.data.error === "Expired or invalid token - please log in again"
    ) {
      yield put(appCreators.clearToken())
      showToast(response.data.error, "error")
    }
    let error =
      response.data.error || "Something Went Wrong, please try again later!"
    showToast(error, "error")
    console.log(error)
    yield put(createReferralCreators.failureCreateCase(error))
  }
}

export function* getInjuryQuestions(action) {
  debugger
  const response = yield call(getQuestions, action.selectedInjuryType.endpoint)
  if (response.ok) {
    console.log({ questions: response.data })
    let endpoint = { endpoint: null }
    if (
      action.endpoint != {} &&
      action.endpoint != null &&
      action.endpoint != undefined
    ) {
      switch (action.endpoint.type) {
        case "radio":
          endpoint = response.data.pathway.find(
            element => element.id === action.endpoint.questionID
          )
          endpoint = endpoint.answers[action.endpoint.answer].endpoint
          break
        case "checkbox":
          endpoint = response.data.pathway.find(
            element => element.id === action.endpoint.questionID
          )
          endpoint = endpoint.answers.endpoint
          break
        case "textarea":
          endpoint = response.data.pathway.find(
            element => element.id === action.endpoint.questionID
          )
          endpoint = endpoint.answers.endpoint
          break
        case "textinput":
          endpoint = response.data.pathway.find(
            element => element.id === action.endpoint.questionID
          )
          endpoint = endpoint.answers.endpoint
          break
        case "visual":
          endpoint = response.data.pathway.find(
            element => element.id === action.endpoint.questionID
          )
          endpoint = endpoint.answers.endpoint
          break
        case "images":
          endpoint = response.data.pathway.find(
            element => element.id === action.endpoint.questionID
          )
          endpoint = endpoint.answers.endpoint
          break
        default:
          break
      }
    }
    if (action.selectedInjuryType.endpoint == "extravasation") {
      yield call(getDrugsOptions)
    }
    yield put(
      createReferralCreators.successInjuryQuestions(response.data, endpoint)
    )
    yield put(createReferralCreators.setTabIndex("4"))
  } else {
    if (response.error === "Expired or invalid token - please log in again") {
      yield put(appCreators.clearToken())
      showToast(response.error, "error")
    }
    let error =
      response.data.error || "Something Went Wrong, please try again later!"
    showToast(error, "error")

    createReferralCreators.failureInjuryQuestions(error)
    // yield put(createReferralCreators.failureCaseCreate(error))
  }
}

export function* submitRheuImages(
  action,
  rheuInves2fileFields,
  rheuInves3fileFields,
) {
  const { caseID, summary } = action
  debugger
  showToast(
    "Uploading Rheaumatalogy screens Images...\nThis could take a moment",
    "info"
  )

  let rheuImageUrlsResponse = yield call(
      rheumatalogyRequestSignedUrls,
      caseID
      )
    

  if (!rheuImageUrlsResponse.ok) {
    showToast("Something went wrong during image upload", "error")
  }

  const rheuInves2ImageUrls = () => {
    const inves2urls = rheuImageUrlsResponse.data.urls.rheuInves2
    Object.keys(rheuInves2fileFields).map(async fieldName => {
      rheuInves2fileFields[fieldName]?.file?.map(async (i, index) => {
        let url = ""
        try {
          url = inves2urls[fieldName][index]
        } catch (e) {
          console.error(e)
        }
        if (url?.length > 0) await uploadImage(url, i.file, i.file.type)
        
      })
    })
  }
  
  const rheuInves3ImageUrls = () => {
    const inves3urls = rheuImageUrlsResponse.data.urls.rheuInves3
    Object.keys(rheuInves3fileFields).map(async fieldName => {
      rheuInves3fileFields[fieldName]?.file?.map(async (i, index) => {
        let url = ""
        try {
          url = inves3urls[fieldName][index]
        } catch (e) {
          console.error(e)
        }

        if(url.length > 0) await uploadImage(url, i.file, i.file.type)
      })
    })
  }

  try {
    rheuInves2ImageUrls()
    rheuInves3ImageUrls()
    // yield Promise.all(rheuInves2ImageUrls);
    // yield Promise.all(rheuInves3ImageUrls);
  } catch (error) {}
}

export function* submitInjurySummary(action) {
  // const {rheuInves2fileFields,rheuInves3fileFields} = action;
  let rheuInves2fileFields = {}
  let rheuInves3fileFields = {}
  debugger
  let copyOfSummary = action?.summary?.map(item => item)
  console.log("sub inj sum", action)
  // checks for images and creates action payload
  debugger;
  let imageSubmit
  let dutyConsultantName = action.summary.find(
    o => o?.question.toLowerCase().includes("duty consultant name") == true
  )
  let dutyConsultantNumber = action.summary.find(
    o => o?.question.toLowerCase().includes("duty consultant number") == true
  )
  let dutyConsultantExtension = action.summary.find(
    o => o?.question.toLowerCase().includes("duty consultant extension") == true
  )
  let transmittableDisease = action.summary.find(
    o =>
      o?.question
        .toLowerCase()
        .includes(
          "is the patient suffering from any communicable disease such as covid-19, mrsa, chickenpox or diarrhoea"
        ) == true
  )
  //gives it true/false value if question exists. if not undefined
  debugger
  if (transmittableDisease != undefined) {
    if (transmittableDisease.answer == "Yes") transmittableDisease = true

    if (transmittableDisease.answer == "No") transmittableDisease = false
  }
  let covid19 = action.summary.find(
    o =>
      o?.question
        .toLowerCase()
        .includes(
          "is the patient suffering from covid-19 or has the patient been exposed to covid-19"
        ) == true
  )
  if (covid19 != undefined) {
    covid19 = covid19.answer
  }
  action.summary.map(item => {
    if (
      item?.type == "images" ||
      item?.currentQuestion?.answers?.type == "images" ||
      item?.type == "opthoimages" ||
      item?.currentQuestion?.answers?.type == "opthoimages" ||
      item?.currentQuestion?.answers?.leftEye == true ||
      item?.currentQuestion?.answers?.rightEye == true
    ) {
      if (item?.answer?.images) {
        imageSubmit = {
          caseID: action.caseID,
          filelist: item.answer.images,
          treatment: item.answer.consents[0].checked,
          research: item.answer.consents[1].checked,
        }
      }
    }
  })
  imageSubmit = {
    ...imageSubmit,
    caseID: action.caseID,
    dutyConsultantExtension: dutyConsultantExtension?.answer,
    dutyConsultantName: dutyConsultantName?.answer,
    dutyConsultantNumber: dutyConsultantNumber?.answer,
  }
  // if action payload, submit images
  if (imageSubmit) yield submitConsentAndImages(imageSubmit)
  let incompleteSummary = copyOfSummary
  incompleteSummary = copyOfSummary.map(item => {
    let type
    let id
    try {
      type = item.currentQuestion.answers.type
      id = item.currentQuestion.id
    } catch (error) {
      type = item.type
      id = item.questionID
    }
    return {
      question: item.question,
      answer: item.answer,
      questionID: id,
      type: type,
    }
  })
  let ansVisual = action.summary.find(
    o => o?.type == "visual" || o?.currentQuestion?.answers?.type == "visual"
  )
  let ansImages = action.summary.find(
    o =>
      o?.type == "images" ||
      o?.currentQuestion?.answers?.type == "images" ||
      o?.type == "opthoimages" ||
      o?.currentQuestion?.answers?.type == "opthoimages"
  )
  let ansDateTime = action.summary.find(
    o =>
      o?.type == "datetime" ||
      o?.currentQuestion?.answers?.type == "datetime" ||
      o?.type == "datetimecalc" ||
      o?.currentQuestion?.answers?.type == "datetimecalc"
  )
  let pathway = [...action?.summary]
  if (ansImages != undefined) pathway.splice(pathway.indexOf(ansImages), 1)
  //if(ansDateTime != undefined) pathway.splice(pathway.indexOf(ansDateTime),1)
  if (ansVisual != undefined) pathway.splice(pathway.indexOf(ansVisual), 1)
  if (ansVisual != undefined)
    yield submitVisualAcuity({
      visualReport: ansVisual.answer,
      caseID: action.caseID,
    })
  //perform that task of replacing file with the counts
  let TotalCount = 0
  if (action?.specialitySelected?.label == "Rheumatology") {
    try {
      //screens are repetative so find that screen question from last to get latest screen question
      let rheuInves2screenObj =
        _.findLast(
          pathway,
          i => i?.currentQuestion?.answers?.type == "rheuInves2"
        ) || {}
      let rheuInves2screenIndex = _.lastIndexOf(
        pathway,
        i => i?.currentQuestion?.answers?.type == "rheuInves2"
      )
      let giInvesscreenObj =
        _.findLast(
          pathway,
          i => i?.currentQuestion?.answers?.type == "rheuInves3"
        ) || {}
      let giInvesscreenIndex = _.lastIndexOf(
        pathway,
        i => i?.currentQuestion?.answers?.type == "rheuInves3"
      )

      if (Object.keys(rheuInves2screenObj?.answer).length > 0) {
        Object.keys(rheuInves2screenObj?.answer).map(fieldName => {
          if (rheuInves2screenObj?.answer[fieldName]?.hasOwnProperty("file")) {
            rheuInves2fileFields[fieldName] = {
              ...rheuInves2screenObj?.answer[fieldName],
            }
            let fieldObj = rheuInves2screenObj?.answer[fieldName]
            let filecount = fieldObj?.file?.length
            TotalCount = TotalCount + filecount

            if (rheuInves2screenObj?.answer[fieldName]?.file)
              console.log("file", rheuInves2screenObj?.answer[fieldName]?.file)

            try {
              rheuInves2screenObj.answer[fieldName].file = filecount
            } catch (e) {
              console.error(e)
            }
          }
        })
      }

      if (Object.keys(giInvesscreenObj?.answer).length > 0) {
        Object.keys(giInvesscreenObj?.answer).map(fieldName => {
          if (giInvesscreenObj?.answer[fieldName]?.hasOwnProperty("file")) {
            rheuInves3fileFields[fieldName] = {
              ...giInvesscreenObj?.answer[fieldName],
            }
            let fieldObj = giInvesscreenObj?.answer[fieldName]
            let filecount = fieldObj?.file?.length
            TotalCount = TotalCount + filecount
            if (giInvesscreenObj?.answer[fieldName]?.file)
              console.log("file", giInvesscreenObj?.answer[fieldName]?.file)
            try {
              giInvesscreenObj.answer[fieldName].file = filecount
            } catch (e) {
              console.error(e)
            }
          }
        })
      }
debugger;
      // add answer to all multiple screens for inves2 screen
      pathway.forEach((item, index)=>{
        if(item?.currentQuestion?.answers?.type == "rheuInves2"){
            if(rheuInves2screenObj?.answer){
               pathway[index]['answer'] = rheuInves2screenObj?.answer;
            }
        }
      })

       // add answer to all multiple screens for inves3 screen
       pathway.forEach((item, index)=>{
        if(item?.currentQuestion?.answers?.type == "rheuInves3"){
            if(giInvesscreenObj?.answer){
              pathway[index]['answer'] = giInvesscreenObj?.answer;
            }
        }
      })

    } catch (error) {
      console.log(error)
    }
  }

  let pathwaySummary = pathway.map(item => {
    let type
    let id
    try {
      type = item.currentQuestion.answers.type
      id = item.currentQuestion.id
    } catch (error) {
      type = item.type
      id = item.questionID
    }
    if (type == "datetime" || type == "datetimecalc") {
      return {
        question: item.question,
        answer: moment(item.answer).format("DD/MM/YYYY LT"),
        questionID: id,
        type: type,
      }
    }
    return {
      question: item.question,
      answer: item.answer,
      questionID: id,
      type: type,
    }
  })
  const response = yield call(putSubmitCase, {
    caseID: action.caseID,
    summary: pathwaySummary,
    pathwayOutcome: action.pathwayOutcome,
    pathway: action.pathway.name,
    specialitySelected: action.specialitySelected.value,
    dateTimeOfInjury: ansDateTime?.answer,
    EUUID: action.euuid,
    transmittableDisease,
    covid19,
    incompleteSummary
  })
  console.warn(response)
  debugger
  if (response.ok) {
    showToast(response.data.message, "success")
    //upload rheuimages
    if (action?.specialitySelected?.label == "Rheumatology" && TotalCount > 0) {
      yield submitRheuImages(action, rheuInves2fileFields, rheuInves3fileFields)
    }
    if (action.specialitySelected.value.includes("160")) {
      yield getInjurySummaryLeafLets(action)
    }
    let actionContent
    pathwaySummary.map((item, index) => {
      let question = action?.questions?.find(o => o?.id == item.questionID)
      if (question?.answers?.[item.answer]?.action != undefined) {
        actionContent = question.answers[item.answer].action
      }
      if (question?.answers?.action != undefined) {
        actionContent = question.answers.action
      }
    })
    if (actionContent != undefined)
      yield put(createReferralCreators.setAction(actionContent))
    if (action.needEndpoint) {
      yield getEndpoint(action)
    } else {
      yield getOnCallRegistrarDetails()
    }
    yield put(createReferralCreators.setTabIndex("7"))
    yield put(createReferralCreators.successInjurySummary(response.data))
  } else {
    console.log("ERROR SENDING pathway response.")
    if (response?.error === "Expired or invalid token - please log in again") {
      showToast(response?.error, "error")
      yield put(appCreators.clearToken())
    }
    let error =
      response?.data?.error || "Something Went Wrong, please try again later!"
    showToast(error, "error")

    yield put(createReferralCreators.failureInjurySummary(error))
  }
}

export function* submitVisualAcuity(action) {
  debugger
  const { visualReport, caseID } = action
  const response = yield call(uploadVisual, { visualReport, caseID })
  if (response.ok) {
    showToast("Uploaded Visual Acuity report", "success")
    yield put(createReferralCreators.successVisualAcuity())
  } else {
    showToast(
      "There was a problem when uploading the Visual Acuity report",
      "error"
    )
    yield put(createReferralCreators.failureVisualAcuity())
  }
}

async function handleEndpointLeaflets(leaflets) {
  let obj = {
    clinicianLeaflets: [],
    patientLeaflets: [],
  }
  leaflets.clinicianLeaflets.forEach(item => {
    obj.clinicianLeaflets.push(item)
  })
  leaflets.patientLeaflets.forEach(item => {
    obj.patientLeaflets.push(item)
  })
  return obj
}

export function* getEndpoint(action) {
  debugger
  
  const { caseID, pathwayOutcome, euuid } = action
  console.log(caseID, pathwayOutcome, euuid, 'getEndpoint')
  const response =
    euuid != null
      ? yield call(getNewDecisionScreen, caseID, euuid, pathwayOutcome)
      : yield call(getDecisionScreenDetails, caseID, pathwayOutcome)
  if (response.ok) {
    yield getOnCallRegistrarDetails()
    if ("leaflets" in response?.data?.result?.Section1) {
      if (typeof response.data.result.Section1.leaflets == "object") {
        const res = yield call(
          handleEndpointLeaflets,
          response.data.result.Section1.leaflets
        )
        yield put(createReferralCreators.successLeaflets(res))
      }
    }
    yield put(createReferralCreators.successEndpoint(response.data))
  } else {
    let error = response.data.error
    console.log(error)
    showToast(error, "error")
    yield put(createReferralCreators.failureEndpoint(error))
  }
}

export function* getReauScreens() {
  try {
    const response = yield call(getReauScreenFields)
    console.log("screen", response)
    if (response.ok) {
      console.log("response screens", response.data)
      yield put(createReferralCreators.successReauScreens(response.data))
    }
  } catch (err) {
    console.log(err)
  }
}

export function* getInjurySummaryLeafLets(action) {
  try {
    console.log("INJURY LEF", action)
    const { caseID } = action
    const response = yield call(getSummaryLeaflets, caseID)
    if (response.ok) {
      console.log("data:", response.data)
      yield put(createReferralCreators.successLeaflets(response.data))
    } else {
      let error = response.data.error
      console.log(error)
      showToast(error, "error")
      yield put(createReferralCreators.failureLeaflets(error))
    }
  } catch (error) {
    showToast("Error fetching leaflets", "error")
    yield put(createReferralCreators.failureLeaflets(error))
  }
}

export function* submitConsentAndImages(action) {
  const {
    caseID,
    filelist,
    treatment,
    research,
    dutyConsultantNumber,
    dutyConsultantName,
    dutyConsultantExtension,
  } = action
  console.log({ action })
  //submits consent - the questions asked in the image screen

  const caseConsentResponse = yield call(postCaseConsent, {
    caseID,
    treatment,
    research,
    dutyConsultantName,
    dutyConsultantNumber,
    dutyConsultantExtension,
  })
  debugger
  console.log(caseConsentResponse)
  console.log(filelist, "buried treasure")
  if (caseConsentResponse.ok) {
    //if the filelist is an an array it is the normal (i.e plastics - single image upload screen)
    if (!Array.isArray(filelist)) {
      //Opthalmology image upload
      if (filelist?.leftEye?.length > 0 || filelist?.rightEye?.length > 0) {
        showToast("Uploading Images...\nThis could take a moment", "info")

        let payload = {
          leftEye: [],
          rightEye: [],
        }
        //['other','OCT']
        payload = {
          leftEye: filelist?.leftEye?.map(i => i.ophthoType) || [],
          rightEye: filelist?.rightEye?.map(i => i.ophthoType) || [],
        }
        console.log(payload, "treasure")
        const opthoimageUrlsResponse = yield ophthalmologyRequestSignedUrls(
          caseID,
          payload
        )
        // returns
        // {
        //  leftEye: ['url1','url2']
        //  rightEye: ['url3','url4']
        // }
        if (!opthoimageUrlsResponse.ok) {
          showToast("Something went wrong during image upload", "error")
          return yield put(
            createReferralCreators.failureConsentAndImages(
              opthoimageUrlsResponse?.data?.message
            )
          )
        }
        //Object.keys(rheumImages).map(()=>{
        //
        //})
        const opthoimageVideoUrlsL = opthoimageUrlsResponse.data?.leftEye?.map(
          async (item, index) => {
            if (filelist.leftEye[index]?.preview.startsWith("blob") && filelist.leftEye[index] instanceof File) {
              await uploadImage(
                item.url,
                filelist.leftEye[index],
                filelist.leftEye[index].type
              )
            } else if(filelist.leftEye[index]?.preview.startsWith("blob") && !(filelist.leftEye[index] instanceof File)){
              let blob = await fetch(filelist.leftEye[index]?.preview).then(r => r.blob());
              await uploadImage(
                item.url,
                blob,
                filelist.leftEye[index].mimeType || 'image/jpeg'
              )
            }
          }
        )
        const opthoimageVideoUrlsR = opthoimageUrlsResponse.data?.rightEye?.map(
          async (item, index) => {
            if (filelist.rightEye[index]?.preview.startsWith("blob") && filelist.rightEye[index] instanceof File) {
              await uploadImage(
                item.url,
                filelist.rightEye[index],
                filelist.rightEye[index].type
              )
            } else if(filelist.rightEye[index]?.preview.startsWith("blob") && !(filelist.rightEye[index] instanceof File)){
              let blob = await fetch(filelist.rightEye[index]?.preview).then(r => r.blob());
              await uploadImage(
                item.url,
                blob,
                filelist.rightEye[index].mimeType || 'image/jpeg'
              )
            }
          }
        )

        try {
          yield Promise.all(opthoimageVideoUrlsL)
          yield Promise.all(opthoimageVideoUrlsR)
        } catch (error) {
          console.log("ERROR", { error })
        }

        console.log("opthoia", opthoimageVideoUrlsL)
      }
    } else {
      // the single image upload screen logic
      let fileList = filelist?.filter(item => item?.preview.startsWith("blob"))
      if (fileList?.length > 0) {
        showToast("Uploading Images...\nThis could take a moment", "info")
        const imageUrlsResponse = yield getImageUrls(caseID, fileList.length)
        console.log("caseConsentResponse")
        const imageVideoUrls = imageUrlsResponse.data.urls.map(
          async (imageVideoUrl, index) => {
            if (fileList[index]?.preview.startsWith("blob") && fileList[index] instanceof File) {
              await uploadImage(
                imageVideoUrl,
                fileList[index],
                fileList[index].type
              )
            } else if(fileList[index]?.preview.startsWith("blob") &&  !(fileList[index] instanceof File)){
              let blob = await fetch(fileList[index]?.preview).then(r => r.blob());
              await uploadImage(
                imageVideoUrl,
                blob,
                fileList[index].mimeType || 'image/jpeg'
              )
            }
          }
        )
        try {
          yield Promise.all(imageVideoUrls)
        } catch (error) {
          console.log({ error })
        }
      }
    }
    //   showToast(
    //       `Case Reference: ${caseID} submitted successfully.`,
    //       'success'
    //   );

    try {
      // const decisionScreenDetailResponse = yield call(getDecisionScreenDetails, caseID)
      // yield put(createReferralCreators.updateDecisionScreenDetails(decisionScreenDetailResponse.data.result))
    } catch (e) {
      console.log(e)
    } finally {
      yield put(
        createReferralCreators.successConsentAndImages(caseConsentResponse)
      )
    }
  } else {
    if (
      caseConsentResponse?.error ===
      "Expired or invalid token - please log in again"
    ) {
      yield put(appCreators.clearToken())
    }
    let error =
      caseConsentResponse?.data?.error ||
      "Something Went Wrong, please try again later!"
    showToast(error, "error")

    yield put(createReferralCreators.failureConsentAndImages(error))
  }
}

export function* getOnCallRegistrarDetails(action) {
  const response = yield call(getOnCall,action?.speciality)
  if (response.ok) {
    const onCallNumber = response.data.onCallNumber
    yield put(
      createReferralCreators.successOnCallRegistrarDetails(onCallNumber,response.data)
    )
  }
}

export function* submitCaseAtEndpoint(action) {
    debugger;
    const {
        caseID,
        options,
        suggestedAction,
        suggestedActionDescription,
        ids
    } = action;
    if (ids != null && Array.isArray(ids)) {
        yield call(submitLeaflets, action)
    }

    let response;

    if (options?.update != null && options?.update != undefined) {
        yield call(updateCaseStatus, {caseID, ...options.update})
    }

    try {
        response = yield call(
            createReferral,
            caseID,
            options?.lifeThreatening,
            suggestedAction,
            suggestedActionDescription,
            options
        );
    } catch (error) {
        response = yield call(createReferral, caseID);
    }

    if (options?.contacted != null && options?.contacted != undefined) {
        yield call(caseContacted, caseID, options.contacted);
        //open pdf modal
    }
    if (response.ok) {
        yield put(createReferralCreators.successCaseAtEndpoint(response.data));
        showToast('Case succesfully saved', 'success');
        yield put(createReferralCreators.requestCasePDFDetails(caseID,options?.lifeThreatening,suggestedAction,suggestedActionDescription))
    } else {
        showToast('Case succesfully saved', 'success');
        //showToast(response.data.message, 'error');
        yield put(
            createReferralCreators.failureCaseAtEndpoint(response.data.message)
        );
    }
}

export function* submitLeaflets(action) {
  const { ids, caseID } = action
  console.log("action", action)
  if (ids?.length === 0) {
    console.log({ action })
    yield put(createReferralCreators.successLeaflets())
  } else {
    yield call(submitLeafletsApi, caseID, ids)
    yield put(createReferralCreators.successLeaflets())
    showToast("Selected leaflets sent to patient/carer", "success")
  }
}

function getEndpointValue(flag, pathwayName) {
  let res = [
    {
      name: "Birth related upper limb injury",
      endpoint: "birthInjuries",
      flag: ["RQ3160"],
      format: "new",
    },
    {
      name: "Soft tissue injury including hand & arm",
      endpoint: "softTissue",
      flag: ["RQ3160"],
      format: "new",
    },
    {
      name: "Hand and wrist fracture",
      endpoint: "handFractures",
      flag: ["RQ3160"],
      format: "new",
    },
    {
      name: "Urgent Eye Care Pathway",
      endpoint: "salisburyEers",
      flag: ["RNZ130"],
      format: "new",
    },
    {
      name: "EERS",
      endpoint: "eers",
      flag: ["RNZ130"],
      format: "new",
    },
    {
      name: "Suspected ocular or periocular injury",
      endpoint: "opticSuspectedOcular",
      flag: ["RQ3130"],
      format: "new",
    },
    {
      name: "Abnormal appearance of the eye(s)",
      endpoint: "opticAbnormalAppearance",
      flag: ["RQ3130"],
      format: "new",
    },
    {
      name: "Watery or sticky eyes",
      endpoint: "opticWateryEyes",
      flag: ["RQ3130"],
      format: "new",
    },
    {
      name: "Eye alignment/movement problem",
      endpoint: "opticAlignmentProblems",
      flag: ["RQ3130"],
      format: "new",
    },
    {
      name: "Abnormal red reflex",
      endpoint: "opticAbnormalRedReflex",
      flag: ["RQ3130"],
      format: "new",
    },
    {
      name: "Optic nerve concerns",
      endpoint: "opticNerve",
      flag: ["RQ3130"],
      format: "new",
    },
    {
      name: "Retinal anomaly",
      endpoint: "opticRetinalAnomaly",
      flag: ["RQ3130"],
      format: "new",
    },
    {
      name: "Visual symptoms",
      endpoint: "opticVisualSymptoms",
      flag: ["RQ3130"],
      format: "new",
    },
    {
      name: "Other clinical queries or baseline assessments",
      endpoint: "opticClinicalQueries",
      flag: ["RQ3130"],
      format: "new",
    },
    {
      name: "Testing New Endpoints Schema",
      endpoint: "testing",
      flag: ["TST000"],
      format: "new",
    },
    {
      name: "Infections and miscellaneous",
      endpoint: "infectmisc",
      flag: ["RQ3160"],
      format: "new",
    },
    {
      name: "Paediatric Inflammatory Multisystem Syndrome",
      endpoint: "pims",
      flag: ["TST000"],
      format: "new",
    },
    {
      name: "Burns",
      endpoint: "burns",
      flag: ["RQ3160"],
      format: "new",
    },
    {
      name: "Extravasation",
      endpoint: "extravasation",
      flag: ["RQ3160"],
      format: "new",
    },
    {
      name: "Joint Pain",
      endpoint: "joint-pain",
      flag: ["RQ3410"],
      format: "new",
    },
    {
      name: "Paediatric Inflammatory Multisystem Syndrome",
      endpoint: "rheu-pims",
      flag: ["RQ3410"],
      format: "new",
    },
    {
      name: "Swollen Joint",
      endpoint: "swollen-joint",
      flag: ["RQ3410"],
      format: "new",
    },
    {
      name: "Emergency Department",
      endpoint: "emergencyDep",
      flag: ["TST000"],
      format: "new",
    },
  ]

  let ret = {
    value: "",
    format: "",
  }
  debugger
  res.map(item => {
    if (item.name.toLowerCase() == pathwayName.toLowerCase()) {
      ret.value = item.endpoint
      ret.format = item.format
    }
  })
  return ret
}

export function* getIncompleteCase(action) {
  debugger
  const { caseID } = action

  const rheuImageLoad = yield call(rheumatalogyMidRequestSignedUrls, caseID)




  // get the pathway json here and add the currentQuestion in there

  const response = yield call(getOneCase, caseID)
  if (response.ok) {
    let caseData = response.data;
    if (response.data.case.currentTab == "3") {
      let incompleteCase = response.data.case
      let caseDetails = {
        patient: {
          NHSNumber: incompleteCase.NHSNumber,
          dateOfBirth: incompleteCase.dateOfBirth,
          firstName: incompleteCase.firstName,
          lastName: incompleteCase.lastName,
          gender: incompleteCase.gender,
          parent: incompleteCase.parent,
          hospitalNumber: incompleteCase.hospitalNumber,
          nonNHSPatient: incompleteCase?.nonNHSPatient
        },
        caseID: caseID,
      }
      let speciality = {
        flag: incompleteCase.flag,
        label: incompleteCase.specialitySelected,
        receivingOrganisationID: incompleteCase.receivingOrganisationID,
        receivingSpecialityID: incompleteCase.receivingSpecialityID,
        value: incompleteCase.flag,
      }
      yield put(
        createReferralCreators.successIncompleteCase(
          {
            caseDetails,
            speciality,
          },
          incompleteCase.currentTab
        )
      )
      yield call(getAvailablePathways, {
        speciality: { flag: incompleteCase.flag },
      })
      yield put(createReferralCreators.setTabIndex("3"))
    } else if (response.data.case.currentTab == "5") {
      let incompleteCase = response.data.case
      let endpoint = getEndpointValue(
        incompleteCase.flag,
        incompleteCase.pathway
      )
      let caseDetails = {
        patient: {
          NHSNumber: incompleteCase.NHSNumber,
          dateOfBirth: incompleteCase.dateOfBirth,
          firstName: incompleteCase.firstName,
          lastName: incompleteCase.lastName,
          gender: incompleteCase.gender,
          parent: incompleteCase.parent,
          hospitalNumber: incompleteCase.hospitalNumber,
          nonNHSPatient: incompleteCase?.nonNHSPatient
        },
        caseID: caseID,
      }
      let speciality = {
        flag: incompleteCase.flag,
        label: incompleteCase.specialitySelected,
        receivingOrganisationID: incompleteCase.receivingOrganisationID,
        receivingSpecialityID: incompleteCase.receivingSpecialityID,
        value: incompleteCase.flag,
      }
      debugger;
      let rheuImages = {}
      if (incompleteCase.specialitySelected === "Rheumatology") {
        rheuImages = yield call(getRheuImages, caseData?.images)
        yield put(createReferralCreators.successDownloadedRheuImages(rheuImages))
      }

      let pimpsPathwayResponse;
      if (incompleteCase.specialitySelected == "Rheumatology") {
        pimpsPathwayResponse = yield call(getPimsPathway);
      }


      if (incompleteCase.incompleteSummary && incompleteCase.incompleteSummary.length > incompleteCase.summary.length) {
        incompleteCase.summary = [...incompleteCase.incompleteSummary]
      }
      let questionAnswers = incompleteCase.summary.map((item, index) => {
        if (item.type == "datetime" || item.type == "datetimecalc") {
          return {
            ...item,
            answer: moment(item.answer, "DD/MM/YYYY LT").toDate(),
          }
        }
        if (incompleteCase.specialitySelected == "Rheumatology") {
          if (pimpsPathwayResponse.ok) {
            let pathwayQuestions = pimpsPathwayResponse.data.pathway;
            item = {
              ...item,
              currentQuestion: findQuestionBasedOnId(item.questionID, pathwayQuestions)
            }
            debugger;
            if (item?.currentQuestion?.CID != undefined) {
              let answer = item.answer
              if (typeof item.answer == 'object' && rheuImages?.[item.type] != undefined) {
                Object.keys(answer).map(key => {
                  if ((answer[key]?.images && Array.isArray(answer[key].images)) || (typeof answer[key].file == 'number' && (rheuImages?.[item.type]?.[key]?.length === answer[key]?.file))) {
                    answer[key].file = rheuImages[item.type][key]
                  }
                })
                console.log('LISTENTOANSWER', answer, rheuImages)
              }

              return {
                question: item.question,
                questionID: item.questionID,
                type: item.type,
                answer: answer,
                givenAnswer: answer,
                currentQuestion: item.currentQuestion
              }
            }
          }
        }
        if (item.type == "visual") {
          return {
            question: item.question,
            questionID: item.questionID,
            type: item.type,
            answer: item.answer,
            givenAnswer: item.answer,
          }
        }
        if (item.type == "opthoimages" || item.type == "images") {
          return {
            question: item.question,
            questionID: item.questionID,
            type: item.type,
            answer: item.answer,
          }
        }
        return item
      })
      let imageQuestion = incompleteCase.summary.find(
        o =>
          o?.type == "images" ||
          o?.currentQuestion?.answers?.type == "images" ||
          o?.type == "opthoimages" ||
          o?.currentQuestion?.answers?.type == "opthoimages"
      )
      let index = incompleteCase.summary.indexOf(imageQuestion)
      //For some reason editing imageQuestion also directly edits incompleteCase.summary - I don't like it but it happens.
      //I dont quite understand why - should revist 

      //if array then images if not then ophthoimages
      if (imageQuestion != undefined && Array.isArray(imageQuestion.answer.images)) {
        let imageList = yield call(getImages, response.data.images)
        Array.isArray(imageList) && imageList?.map((item, index) => {
          imageQuestion.answer.images[index] = {
            ...imageQuestion.answer.images[index],
            preview: URL.createObjectURL(item.src),
            name: imageQuestion.answer.images[index].path || ''
          }
        })
      } else if (imageQuestion != undefined && !Array.isArray(imageQuestion.answer.images)) {
        let imageList = yield call(getImages, response.data.ophthalmologyImages)
        imageList?.rightEye?.map((item, index) => {
          imageQuestion.answer.images.rightEye[index] = {
            ...imageQuestion.answer.images.rightEye[index],
            preview: URL.createObjectURL(item.src),
            name: imageQuestion.answer.images.rightEye[index].path
          }
        })
        imageList?.leftEye?.map((item, index) => {
          imageQuestion.answer.images.leftEye[index] = {
            ...imageQuestion.answer.images.leftEye[index],
            preview: URL.createObjectURL(item.src),
            name: imageQuestion.answer.images.leftEye[index].path
          }
        })
      }
      let decision = incompleteCase.pathwayOutcome
      let selectedPathway = {
        name: incompleteCase.pathway,
        endpoint: endpoint,
        flag: [incompleteCase.flag],
      }
      let lastQuestion = {}
      let euuid = incompleteCase.EUUID
      console.log(questionAnswers)
      if (endpoint.format == "new") {
        lastQuestion = questionAnswers[questionAnswers.length - 1]
      }
      yield call(getInjuryQuestions, {
        selectedInjuryType: { endpoint: endpoint.value },
        endpoint: null,
      })
      yield call(getAvailablePathways, {
        speciality: { flag: incompleteCase.flag },
      })
      yield put(
        createReferralCreators.successIncompleteCase(
          {
            caseDetails,
            speciality,
            questionAnswers,
            decision,
            selectedPathway,
            euuid,
          },
          incompleteCase.currentTab
        )
      )
      yield put(createReferralCreators.setTabIndex("5"))
    } else if (response.data.case.currentTab == "4") {
      debugger;
      let incompleteCase = response.data.case
      let endpoint = getEndpointValue(
        incompleteCase.flag,
        incompleteCase.pathway
      )
      let caseDetails = {
        patient: {
          NHSNumber: incompleteCase.NHSNumber,
          dateOfBirth: incompleteCase.dateOfBirth,
          firstName: incompleteCase.firstName,
          lastName: incompleteCase.lastName,
          gender: incompleteCase.gender,
          parent: incompleteCase.parent,
          hospitalNumber: incompleteCase.hospitalNumber,
          nonNHSPatient: incompleteCase?.nonNHSPatient
        },
        caseID: caseID,
      }
      let speciality = {
        flag: incompleteCase.flag,
        label: incompleteCase.specialitySelected,
        receivingOrganisationID: incompleteCase.receivingOrganisationID,
        receivingSpecialityID: incompleteCase.receivingSpecialityID,
        value: incompleteCase.flag,
      }
      let rheuImages = {}
      if (incompleteCase.specialitySelected === "Rheumatology") {
        rheuImages = yield call(getRheuImages, caseData?.images)
        yield put(createReferralCreators.successDownloadedRheuImages(rheuImages))
      }
      let questionAnswers = incompleteCase.summary.map((item, index) => {
        if (item.type == "datetime" || item.type == "datetimecalc") {
          return {
            ...item,
            answer: moment(item.answer, "DD/MM/YYYY LT").toDate(),
          }
        }
        if (item.type == "visual") {
          return {
            question: item.question,
            questionID: item.questionID,
            type: item.type,
            answer: item.answer,
            givenAnswer: item.answer,
          }
        }
        if (item?.currentQuestion?.CID != undefined) {
          console.log('rheuimage', rheuImages)
          let answer = item.answer
          if (typeof item.answer == 'object' && rheuImages?.[item.type] != undefined) {
            Object.keys(answer).map(key => {
              if (answer[key]?.images && Array.isArray(answer[key]?.images)) {
                answer[key].file = rheuImages[item.type][key]
              }
            })
            console.log('LISTENTOANSWER', answer)
          }

          return {
            question: item.question,
            questionID: item.questionID,
            type: item.type,
            answer: answer,
            givenAnswer: answer,
            currentQuestion: item.currentQuestion
          }
        }
        if (item.type == "opthoimages" || item.type == "images") {
          return {
            question: item.question,
            questionID: item.questionID,
            type: item.type,
            givenAnswer: item.answer,
            answer: item.answer
          }
        }
        return item
      })
      //if last question is a calc question -> then we go back one more step before performing calculation
      if (questionAnswers[questionAnswers.length - 1]?.currentQuestion?.calculation === true) {
        questionAnswers.pop();
      }

      debugger
      let imageQuestion = incompleteCase.summary.find(
        o =>
          o?.type == "images" ||
          o?.currentQuestion?.answers?.type == "images" ||
          o?.type == "opthoimages" ||
          o?.currentQuestion?.answers?.type == "opthoimages"
      )
      
      if (imageQuestion != undefined && Array.isArray(imageQuestion.answer.images)) {
        let imageList = yield call(getImages, response.data.images)
        Array.isArray(imageList) && imageList?.map((item, index) => {
          imageQuestion.answer.images[index] = {
            ...imageQuestion.answer.images[index],
            preview: URL.createObjectURL(item.src),
            name: imageQuestion.answer.images[index].path || ''
          }
        })
      } else if (imageQuestion != undefined && !Array.isArray(imageQuestion.answer.images)) {
        let imageList = yield call(getImages, response.data.ophthalmologyImages)
        imageList?.rightEye?.map((item, index) => {
          imageQuestion.answer.images.rightEye[index] = {
            ...imageQuestion.answer.images.rightEye[index],
            preview: URL.createObjectURL(item.src),
            name: imageQuestion.answer.images.rightEye[index].path
          }
        })
        imageList?.leftEye?.map((item, index) => {
          imageQuestion.answer.images.leftEye[index] = {
            ...imageQuestion.answer.images.leftEye[index],
            preview: URL.createObjectURL(item.src),
            name: imageQuestion.answer.images.leftEye[index].path
          }
        })
      }
      let questionID = questionAnswers[questionAnswers.length - 1].questionID
      questionAnswers = questionAnswers.slice(0, -1) // removes last element from array. stops duplication of answers
      let lastResponse = questionAnswers[questionAnswers.length - 1]
      if (lastResponse?.calculation == true) {
        lastResponse = questionAnswers[questionAnswers.length - 1]
        questionID = questionAnswers[questionAnswers.length - 1].questionID
        questionAnswers = questionAnswers.slice(0, -1) // removes last element from array. which is calculation question
      }

      let selectedPathway = {
        name: incompleteCase.pathway,
        endpoint: endpoint,
        flag: [incompleteCase.flag],
      }
      let lastQuestion = {}
      console.log(questionAnswers)
      if (endpoint.format == "new") {
        lastQuestion = questionAnswers[questionAnswers.length - 1]
      }
      yield call(getInjuryQuestions, {
        selectedInjuryType: { endpoint: endpoint.value },
        endpoint: lastQuestion,
      })
      yield call(getAvailablePathways, {
        speciality: { flag: incompleteCase.flag },
      })
      debugger;
      yield put(
        createReferralCreators.successIncompleteCase(
          {
            caseDetails,
            speciality,
            questionAnswers,
            selectedPathway,
            questionID,
            lastResponse,
          },
          incompleteCase.currentTab
        )
      )
      yield put(createReferralCreators.setTabIndex("4"))
    }
  } else {
    if (response.error == "Expired or invalid token - please log in again") {
      appCreators.clearToken()
    } else {
      showToast(response.error, "error")
    }
  }
}

export function* getFeedbackQuestions(action) {
  const response = yield call(getFeedbackqna)
  if (response.ok) {
    yield put(createReferralCreators.successFeedbackQna(response.data))
    //  console.log(response.data.message)
  } else {
    if (
      response.data.error === "Expired or invalid token - please log in again"
    ) {
      yield put(appCreators.clearToken())
      showToast(response.data.error, "error")
    }
    let error =
      response.data.error || "Something Went Wrong, please try again later!"
    showToast(error, "error")
    console.log(error)
  }
}

export function* getDrugsOptions(action) {
  try {
    let response = yield call(getDrugs)
    let drugList = response.data.drugs.map((item, index) => {
      return {
        label: item.name,
        value: item.name,
        ragStatus: item.ragStatus,
      }
    })
    yield put(createReferralCreators.successDrugs(drugList))
  } catch (error) {
    console.log("DRUG ERROR", error)
    yield put(createReferralCreators.failureDrugs())
  }
}

//By firstname, lastname, dateofbirth
export function* searchPatient(action){
  try {
      const response = yield call(getPDSSearch, action.params)
      if(response.ok){
          debugger;
          let data = response.data.data.entry[0].resource
          let GP = response.data.GP
          console.log(GP, 'gp')
          let GPPhoneNumberShortened = GP?.telecom?.find(item => item.system == 'phone')?.value ? (GP?.telecom?.find(item => item.system == 'phone')?.value).replace(/\s/g, "") : ''
          let patientInfo = {
            dateOfBirth: data?.birthDate,
            gender: data?.gender,
            firstName: data?.name[data?.name.length -1].given[0],
            lastName: data?.name[data?.name.length -1].family,
            NHSNumber: action?.number == data?.id ? action?.number : data?.id,
            prefix: data?.name[data?.name.length -1]?.prefix,
            postCode: data?.address[data?.address.length -1]?.postalCode,
            patientAddress: data?.address[data?.address.length -1]?.line.join(', '),
            contactNumber: data?.telecom?.find(item => item.system == 'phone')?.value || '',
            emailAddress: data?.telecom?.find(item => item.system == 'email')?.value || '',
            GPid: response.data.GP.id || '',
            GPAddress:  GP?.address?.line[0]  + ', ' +  GP?.address?.postalCode + ', ' + GP?.address?.city || '',
            GPEmailAddress: GP?.telecom?.find(item => item.system == 'email')?.value || '',
            GPPhoneNumber: GPPhoneNumberShortened || '',
            GPName: GP?.name  || ''
      }
        
          if(data.meta.security[0].code != 'U'){
              showToast("Patient has restricted records", 'info')
          }
          if(action?.number != data?.id){
              showToast('Patient has new NHS Number', 'info')
          }
          yield put(createReferralCreators.successPatientData(patientInfo))
      }
      else{
          yield put(createReferralCreators.failurePatientData())
          showToast(response?.data?.message,"error")
      }
  } catch (error) {
      console.log(error)
      yield put(createReferralCreators.failurePatientData())
      showToast("Something went wrong","error")
  }
}

//By NHS Number
export function* getPatientdata(action){

    console.log("in patient saga")
    try{
        let response = yield call(getPatientFormdata,action?.number)
        if(response.ok){
            debugger;
            let data = response.data.data
            let GP = response.data.GP
            let GPPhoneNumberShortened = GP?.telecom?.find(item => item.system == 'phone')?.value ? (GP?.telecom?.find(item => item.system == 'phone')?.value).replace(/\s/g, "") : ''
          
            let patientInfo = {
                dateOfBirth: data?.birthDate,
                gender: data?.gender,
                firstName: data?.name[data?.name.length -1].given[0],
                lastName: data?.name[data?.name.length -1].family,
                NHSNumber: action?.number == data?.id ? action?.number : data?.id,
                prefix: data?.name[data?.name.length -1]?.prefix,
                postCode: data?.address[data?.address.length -1]?.postalCode,
                patientAddress: data?.address[data?.address.length -1]?.line.join(', '),
                contactNumber: data?.telecom?.find(item => item.system == 'phone')?.value || '',
                emailAddress: data?.telecom?.find(item => item.system == 'email')?.value || '',
                GPid: response.data.GP.id,
                GPAddress:  GP?.address?.line[0]  + ', ' +  GP?.address?.postalCode + ', ' + GP?.address?.city || '',
                GPEmailAddress: GP?.telecom?.find(item => item.system == 'email')?.value || '',
                GPPhoneNumber: GPPhoneNumberShortened || '',
                GPName: GP?.name || '',
          }
            
            
            let odsCode = {ODSCode: data?.generalPractitioner[0].identifier.value}
            // if(odsCode){
            //     let gpResponse = yield call(getGPDetails,odsCode.ODSCode)
            //     let gpDetails = {
            //         practiceName: gpResponse.data.name,
            //     contactNumber: gpResponse.data?.telecom[0]?.value?.replace(/\s/g, ""),
            //     address: `${gpResponse.data.address.line.join(', ')}, ${gpResponse.data.address.city}, ${gpResponse.data.address.district}, ${gpResponse.data.address.postalCode}, ${gpResponse.data.address.country}`
            //     }
            //     patientInfo = {
            //         ...patientInfo,
            //         gpDetails
            //     }
            //     odsCode = {
            //         ...odsCode,
            //         ...gpDetails
            //     }
            // }
            if(data.meta.security[0].code != 'U'){
              showToast("Patient has restricted records", 'info')
          }
          if(action?.number != data?.id){
              showToast('Patient has new NHS Number', 'info')
          }
          yield put(createReferralCreators.successPatientData(patientInfo))
      }
      else{
          yield put(createReferralCreators.failurePatientData())
          showToast(response?.data?.message,"error")
      }
  } catch (error) {
      console.log(error)
      yield put(createReferralCreators.failurePatientData())
      showToast("PDS Error","error")
  }
}

export function* sendUnknownDrugEmail(action) {
  try {
    if (action.name != undefined) {
      let response = yield call(drugNotFound, action.name)
      showToast("Pharmacy team notified to add drug to list", "info")
    }
  } catch (error) {
    console.log(error)
  }
}

export function* midResponseSave(action) {

  debugger
  console.log("sub inj sum", action)

  let rheuInves2fileFields = {}
  let rheuInves3fileFields = {}
  // if action payload, submit images
  let imageSubmit
  action.summary.map(item => {
    if (
      item?.type == "images" ||
      item?.currentQuestion?.answers?.type == "images" ||
      item?.type == "opthoimages" ||
      item?.currentQuestion?.answers?.type == "opthoimages"
    ) {
      if (item.answer?.images?.length) {
        imageSubmit = {
          caseID: action.caseID,
          filelist: item.answer.images,
          treatment: item.answer.consents[0].checked,
          research: item.answer.consents[1].checked,
        }
      }
    }
  })
  imageSubmit = {
    ...imageSubmit,
    caseID: action.caseID,
  }
  // if action payload, submit images
  if (imageSubmit) yield submitConsentAndImages(imageSubmit)
  let ansVisual = action.summary.find(
    o => o?.type == "visual" || o?.currentQuestion?.answers?.type == "visual"
  )
  let ansImages = action.summary.find(
    o =>
      o?.type == "images" ||
      o?.currentQuestion?.answers?.type == "images" ||
      o?.type == "opthoimages" ||
      o?.currentQuestion?.answers?.type == "opthoimages"
  )
  let ansDateTime = action.summary.find(
    o =>
      o?.type == "datetime" ||
      o?.currentQuestion?.answers?.type == "datetime" ||
      o?.type == "datetimecalc" ||
      o?.currentQuestion?.answers?.type == "datetimecalc"
  )
  let pathway = [...action?.summary]
  //if(ansImages != undefined) pathway.splice(pathway.indexOf(ansImages),1)
  //if(ansDateTime != undefined) pathway.splice(pathway.indexOf(ansDateTime),1)
  //if(ansVisual != undefined) pathway.splice(pathway.indexOf(ansVisual),1)
  if (ansVisual != undefined)
    yield submitVisualAcuity({
      visualReport: ansVisual.answer,
      caseID: action.caseID,
    })

      //perform that task of replacing file with the counts
  let TotalCount = 0
  if (action?.specialitySelected =="RQ3410") {
    try {
      //screens are repetative so find that screen question from last to get latest screen question
      let rheuInves2screenObj =
        _.findLast(
          pathway,
          i => i?.currentQuestion?.answers?.type == "rheuInves2"
        ) || {}
      let rheuInves2screenIndex = _.lastIndexOf(
        pathway,
        i => i?.currentQuestion?.answers?.type == "rheuInves2"
      )
      let giInvesscreenObj =
        _.findLast(
          pathway,
          i => i?.currentQuestion?.answers?.type == "rheuInves3"
        ) || {}
      let giInvesscreenIndex = _.lastIndexOf(
        pathway,
        i => i?.currentQuestion?.answers?.type == "rheuInves3"
      )

      if (Object.keys(rheuInves2screenObj?.answer).length > 0) {
        Object.keys(rheuInves2screenObj?.answer).map(fieldName => {
          if (rheuInves2screenObj?.answer[fieldName]?.hasOwnProperty("file")) {
            rheuInves2fileFields[fieldName] = {
              ...rheuInves2screenObj?.answer[fieldName],
            }
            let fieldObj = rheuInves2screenObj?.answer[fieldName]
            let filecount = fieldObj?.file?.length
            TotalCount = TotalCount + filecount

            if (rheuInves2screenObj?.answer[fieldName]?.file)
              console.log("file", rheuInves2screenObj?.answer[fieldName]?.file)

            try {
              rheuInves2screenObj.answer[fieldName].file = filecount
            } catch (e) {
              console.error(e)
            }
          }
        })
      }

      if (Object.keys(giInvesscreenObj?.answer).length > 0) {
        Object.keys(giInvesscreenObj?.answer).map(fieldName => {
          if (giInvesscreenObj?.answer[fieldName]?.hasOwnProperty("file")) {
            rheuInves3fileFields[fieldName] = {
              ...giInvesscreenObj?.answer[fieldName],
            }
            let fieldObj = giInvesscreenObj?.answer[fieldName]
            let filecount = fieldObj?.file?.length
            TotalCount = TotalCount + filecount
            if (giInvesscreenObj?.answer[fieldName]?.file)
              console.log("file", giInvesscreenObj?.answer[fieldName]?.file)
            try {
              giInvesscreenObj.answer[fieldName].file = filecount
            } catch (e) {
              console.error(e)
            }
          }
        })
      }
debugger;
      // add answer to all multiple screens for inves2 screen
      pathway.forEach((item, index)=>{
        if(item?.currentQuestion?.answers?.type == "rheuInves2"){
            if(rheuInves2screenObj?.answer){
               pathway[index]['answer'] = rheuInves2screenObj?.answer;
            }
        }
      })

       // add answer to all multiple screens for inves3 screen
       pathway.forEach((item, index)=>{
        if(item?.currentQuestion?.answers?.type == "rheuInves3"){
            if(giInvesscreenObj?.answer){
              pathway[index]['answer'] = giInvesscreenObj?.answer;
            }
        }
      })

    } catch (error) {
      console.log(error)
    }
  }



  let pathwaySummary = pathway.map(item => {
    let type
    let id
    try {
      type = item.currentQuestion.answers.type
      id = item.currentQuestion.id
    } catch (error) {
      type = item.type
      id = item.questionID
    }
    let ans
    if (typeof item?.givenAnswer != "undefined") {
      ans = item.givenAnswer
    } else {
      ans = item.answer
    }
    if (type == "datetime" || type == "datetimecalc") {
      let date
      if (typeof item?.givenAnswer != "undefined") {
        date = moment(item.givenAnswer).format("DD/MM/YYYY LT")
      } else {
        date = moment(item.answer).format("DD/MM/YYYY LT")
      }
      return {
        question: item.question,
        answer: date,
        questionID: id,
        type: type,
      }
    }
  debugger;
    return {
      question: item.question,
      answer: ans,
      questionID: id,
      type: type,
      currentQuestion:item?.currentQuestion,
    }
  })
  const response = yield call(putMidResponse, {
    caseID: action.caseID,
    summary: pathwaySummary,
    pathway: action.pathway,
    specialitySelected: action.specialitySelected,
    dateTimeOfInjury: ansDateTime?.answer,
  })
  console.warn(response)
  debugger
  if (response.ok) {
    showToast("Case Succesfully Saved", "success")
    
  if (action?.specialitySelected =="RQ3410" && TotalCount > 0) {
      yield submitRheuImages(action, rheuInves2fileFields, rheuInves3fileFields);
    }
    yield put(createReferralCreators.successMidResponse())
  } else {
    console.log("ERROR Saving mid pathway")
    if (response.error === "Expired or invalid token - please log in again") {
      showToast(response.error, "error")
      yield put(appCreators.clearToken())
    }
    let error =
      response.data.error || "Unable to save the case. Please Try again later."
    showToast(error, "error")

    yield put(createReferralCreators.failureMidResponse(error))
  }
}

export function* getReauScreensNextID(action) {
  try {
    const { pathway, casID, currentID, progress } = action
    console.log("progress", progress)

    const response = yield call(
      getRheuNextQuestionId,
      pathway,
      casID,
      currentID,
      progress
    )
    console.log("response", response.data)
    if (response.ok) {
      yield put(createReferralCreators.successReauNextId(response?.data))
    }
  } catch (err) {
    console.error(err)
  }
}

export function* getCasePdfDownload(action) {
  try {
    const {
      caseID,
      lifeThreatening,
      suggestedAction,
      suggestedActionDescription,
    } = action

    const response = yield call(
      requestCasePdfDownload,
      caseID,
      lifeThreatening,
      suggestedAction,
      suggestedActionDescription,
    )

    if (response.ok) {
      //window.open(url);
      const blob = new Blob([response.data], { type: "application/pdf" }) // data for pdf to download
      saveAs(blob, caseID + ".pdf")
    }
  } catch (err) {
    console.error(err)
  }
}

export function* getCasePdfDetails(action) {
  try {
    const {
      caseID,
      lifeThreatening,
      suggestedAction,
      suggestedActionDescription,
    } = action

    const response = yield call(
      requestCasePdfDownload,
      caseID,
      lifeThreatening,
      suggestedAction,
      suggestedActionDescription,
    )
debugger;
    if (response.ok) {
      const url = window.URL.createObjectURL(response.data); //url for pdf 
      //window.open(url);
      const blob = new Blob([response.data], { type: "application/pdf" }) // data for pdf to download
      const pdfName  = caseID + ".pdf";
      yield put(createReferralCreators.successCasePDFDetails(blob,url,pdfName))

      // saveAs(blob, caseID + ".pdf")
    }
  } catch (err) {
    console.error(err)
  }
}



export function* cancelCaseAtId(action){
  const {caseID,userId} = action

  try{
    const response = yield call(setCaseCanceled,caseID,userId)
    if (response.ok) {
      yield put(createReferralCreators.successCaseCancel())
      action.refreshlist();
      showToast(response.data.message, "")
       console.log(response.data)
    } else {
      if (
        response.data.error === "Expired or invalid token - please log in again"
      ) {
        yield put(appCreators.clearToken())
        showToast(response.data.error, "success")
      }
      let error =
        response.data.error || "Something Went Wrong, please try again later!"
      showToast(error, "error")
      console.log(error)
    }
  }
  catch(err){

  }
}

export function* saveContactData(action){
  const {caseID, contacted} = action
  try{
    console.log(action, 'tree');
    const response = yield call(saveContactedData, {caseID, contacted})
    if (response.ok){
      showToast('Contact Record Saved', 'success')
      yield put(createReferralCreators.successSaveContactData())
    }
    else{
      showToast('Something went wrong', 'error');
      yield put(createReferralCreators.failureSaveContactData())
    }
  }
  catch(error){

  }
}

export function* findLocalHospital(action){

  try{
    const response = yield call(findLocalHospitalBMEC, action)
    if (response.ok){
      console.log(response, 'found')
      yield put(createReferralCreators.findLocalHospitalSuccess(response?.data))
    }
    else{
      console.log('it broke')
    }
  }
  catch(err){
    console.log(err)
  }
}



export function* watchGetPathways() {
  yield takeLatest(GET_SUBSCRIPTIONS, getSubscriptions)
  yield takeLatest(GET_AVAILABLE_PATHWAYS, getAvailablePathways)
  yield takeLatest(CREATE_CASE, createCase)
  yield takeLatest(GET_INJURY_QUESTIONS, getInjuryQuestions)
  yield takeLatest(SUBMIT_INJURY_SUMMARY, submitInjurySummary)
  yield takeLatest(REQUEST_LEAFLETS, getInjurySummaryLeafLets)
  yield takeLatest(SUBMIT_CONSENT_AND_IMAGES, submitConsentAndImages)
  yield takeLatest(REQUEST_ON_CALL_REGISTRAR_DETAILS, getOnCallRegistrarDetails)
  yield takeLatest(SUBMIT_CASE_AT_ENDPOINT, submitCaseAtEndpoint)
  yield takeLatest(SEND_LEAFLETS, submitLeaflets)
  yield takeLatest(REQUEST_INCOMPLETE_CASE, getIncompleteCase)
  yield takeLatest(REQUEST_FEEDBACK_QNA, getFeedbackQuestions)
  yield takeLatest(SUBMIT_VISUAL_ACUITY, submitVisualAcuity)
  yield takeLatest(GET_DRUGS, getDrugsOptions)
  yield takeLatest(REQUEST_PATIENT_DATA, getPatientdata)
  yield takeLatest(SEND_UNKNOWN_DRUG_EMAIL, sendUnknownDrugEmail)
  yield takeLatest(SAVE_MID_RESPONSE, midResponseSave)
  yield takeLatest(GET_REAU_SCREENS, getReauScreens)
  yield takeLatest(REQUEST_REAU_NEXT_ID, getReauScreensNextID)
  yield takeLatest(REQUEST_CASE_PDF, getCasePdfDownload)
  yield takeLatest(REQUEST_CASE_PDF_DETAILS, getCasePdfDetails)
  yield takeLatest(REQUEST_CASE_CANCEL,cancelCaseAtId)
  yield takeLatest(SEARCH_PATIENT_DATA, searchPatient)
  yield takeLatest(SAVE_CONTACT_DATA, saveContactData)
  yield takeLatest(FIND_LOCAL_HOSPITAL, findLocalHospital)
 
}

function* referralSaga() {
  yield all([fork(watchGetPathways)])
}

export default referralSaga
