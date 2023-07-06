import { caseTypes, caseCreators } from "./reducer";
import {
	call,
	put,
	takeEvery,
	all,
	fork,
	takeLatest,
	takeLeading
} from "redux-saga/effects";
import { showToast } from "utils/toastnotify";

const {
	REQUEST_CASE_DETAILS,
	UPDATE_CASE_DETAILS,
	REQUEST_GET_MESSAGE,
	REQUEST_SEND_MESSAGE,
	REQUEST_SEND_IMG,
	REQUEST_RUBBER_STAMP_QUESTIONS,
	SUBMIT_RUBBER_STAMP_FORM,
} = caseTypes;

import {
	getOneCase,
	updateCase,
	getmessage,
	sendmessage,
	getImageMethod,
	uploadImage,
	getClinicianList,
	reassignCase,
	getQuestions,
	putRubberStamp,
	getRubberStamp,
	
} from "servicies/UserServicies";
import { submitConsentAndImages } from "store/create-referral/saga";
import axios from "axios";
import { useHistory } from "react-router-dom";

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

export async function getImages(images) {
	debugger;
	try {
		if (Array.isArray(images)) {
			let ret = Promise.all(
				images.map(async (url) => {
					const res = await fetch(url);
					const blob = await res.blob();
					const objurl = URL.createObjectURL(blob);
					return { src: objurl, type: blob.type };
				})
			);
			let re = await ret.then((ret) => {
				console.log(ret);
				return ret;
			});
			return re;
		} else if (Array.isArray(images.images)) {
			//when showing rheumatalogy normal images
			let rheuImages = Promise.all(
				images?.images?.map(async (url) => {
					const res = await fetch(url);
					const blob = await res.blob();
					const objurl = URL.createObjectURL(blob);
					return { src: objurl, type: blob.type };
				})
			);
			let re = await rheuImages.then((ret) => {
				console.log(ret);
				return ret;
			});
			return re;
		} else {
			if (Object.keys(images).length > 0) {
				let re = undefined;
				let le = undefined;

				if (images?.rightEye.length > 0) {
					re = Promise.all(
						images?.rightEye?.map(async (url) => {
							const res = await fetch(url.url);
							const blob = await res.blob();
							const objurl = URL.createObjectURL(blob);
							return {
								src: objurl,
								type: blob.type,
								exam: url.type,
							};
						})
					);
				}
				if (images?.leftEye.length > 0) {
					le = Promise.all(
						images?.leftEye?.map(async (url) => {
							const res = await fetch(url.url);
							const blob = await res.blob();
							const objurl = URL.createObjectURL(blob);
							return {
								src: objurl,
								type: blob.type,
								exam: url.type,
							};
						})
					);
				}
				let leftEye = undefined;
				let rightEye = undefined;

				if (typeof le != "undefined") {
					leftEye = await le.then((ret) => {
						return ret;
					});
				}

				if (typeof re != "undefined") {
					rightEye = await re.then((ret) => {
						return ret;
					});
				}
				return { leftEye, rightEye };
			}
		}
	} catch (err) {
		console.log(err);
	}
}

export async function getRheuImages(images) {
	const { rheuInves2, rheuInves3 } = images;
	debugger;
	try {
		if (Object.keys(rheuInves2)?.length > 0) {
			await Promise.all(
				Object.keys(rheuInves2).map(async (fieldName) => {
					await Promise.all(
						rheuInves2[fieldName]?.map(async (url, index) => {
							const res = await fetch(url);
							const blob = await res.blob();
							const objurl = URL.createObjectURL(blob);
							rheuInves2[fieldName][index] = {
								src: objurl,
								type: blob.type,
							};
						})
					);
				})
			);
		}
		if (Object.keys(rheuInves3)?.length > 0) {
			await Promise.all(
				Object.keys(rheuInves3).map(async (fieldName) => {
					await Promise.all(
						rheuInves3[fieldName]?.map(async (url, index) => {
							const res = await fetch(url);
							const blob = await res.blob();
							const objurl = URL.createObjectURL(blob);
							rheuInves3[fieldName][index] = {
								src: objurl,
								type: blob.type,
							};
						})
					);
				})
			);
		}
		return { rheuInves2, rheuInves3 };
	} catch (err) {
		console.log(err);
	}
}

export function* downloadImages(action) {
	debugger;
	try {
		if (typeof action.images == "undefined") {
			yield put(caseCreators.downloadImagesRes([]));
			return;
		}
		if (Array.isArray(action.images) && action.images?.length === 0) {
			yield put(caseCreators.downloadImagesRes([]));
			return;
		} else if (
			action.images?.rightEye?.length === 0 &&
			action.images?.leftEye?.length === 0
		) {
			yield put(
				caseCreators.downloadImagesRes({ rightEye: [], leftEye: [] })
			);
			return;
		} else if (action?.images?.length === 0) {
			yield put(caseCreators.downloadImagesRes([]));
			return;
		}
	} catch (error) {
		yield put(caseCreators.downloadImagesRes([]));
		return;
	}
	let images = yield call(getImages, action.images);
	let rheuImages = yield call(getRheuImages, action.images);
	yield put(caseCreators.downloadImagesRheu(rheuImages));
	yield put(caseCreators.downloadImagesRes(images));
}

export function* getCaseDetails(action) {
	// // alert("demo")
	// console.log({action})
	debugger;

	try {
		const response = yield call(getOneCase, action.selectedCaseID);
		if (response.ok) {
			debugger;
			console.log("getOneCase", response.data);

			if (response.data.case.specialitySelected == "Rheumatology") {
				yield all([
					put(
						caseCreators.requestRubberStampQuestions(
							action.selectedCaseID
						)
					),
					put(
						caseCreators.downloadImages(
							response.data.case.specialitySelected ==
								"Ophthalmology"
								? response.data.ophthalmologyImages
								: response.data.images
						)
					),
					put(
						caseCreators.successCaseDetails({
							...response.data,
							images: null,
						})
					),
				]);
			} else {
				yield all([
					put(
						caseCreators.requestRubberStampQuestions(
							action.selectedCaseID
						)
					),
					put(
						caseCreators.downloadImages(
							response.data.case.specialitySelected ==
								"Ophthalmology"
								? response.data.ophthalmologyImages
								: response.data.images
						)
					),
					put(
						caseCreators.successCaseDetails({
							...response.data,
							images: null,
						})
					),
				]);
			}
		} else {
			if (
				response.error ===
				"Expired or invalid token - please log in again"
			) {
				showToast(response.error, "error");
				yield put(appCreators.clearToken());
			}
		}
	} catch (e) {
		console.log(e);
	}
}

export function* updateCaseDetails(action) {
	//let activeCase = action.updatedCaseDetails.activeCase;

	let payload = action.payload;
	const history = action.history;

	const response = yield call(updateCase, payload);

	if (response.ok) {
		console.warn(response.data);
		showToast("Case Accepted Successfully", "success");
		history.push("/my-referral");

		yield put(caseCreators.successUpdateCaseDetails(response.data));
	} else {
		if (
			response.message ===
			"Error: Case has been edited by another user. Please try again"
		) {
			showToast(response.message, "error");
			yield put(caseCreators.failureUpdateCaseDetails(response.data));
		} else {
			let error =
				response.data.error ||
				"Something Went Wrong, please try again later!";
			showToast(error, "error");
		}
	}
}

export function* getMessages(action) {
	try {
		const response = yield call(getmessage, action.caseID);
		if (response.ok) {
			yield put(caseCreators.successGetMessage(response.data));
		} else {
			yield put(caseCreators.FailureGetMessage());
		}
	} catch (error) {
		showToast(error, "error");
	}
}
export function* sendMessages(action) {
	try {
		let payload = {
			caseID: action.caseID,
			content: action.content,
		};
		const response = yield call(sendmessage, payload);
		if (response.ok) {
			yield put(caseCreators.successSendMessage(response.data));
		} else {
			yield put(caseCreators.FailureSendMessage());
		}
	} catch (error) {
		yield put(caseCreators.FailureSendMessage());
		showToast(error, "error");
	}
}

export function* sendImageMessages(action) {
	const imgFile = action.imgFile;

	const response = yield call(getImageMethod, action.caseID, 1);
	if (response.error) {
		showToast(response?.error?.message, "error");
	}
	console.log("file", imgFile);
	console.log(response);
	const imgurls = [];
	console.log(JSON.stringify(response.data.urls));
	const imageVideoUrl = response.data.urls.map((ele, key) => {
		imgurls[key] = ele;
	});
	length = response.data.urls.length;
	console.log("length", length);
	for (let i = 0; i < length; i++) {
		console.log("in loop", imgurls[i]);

		//   dispatch(referralActions.sendMessageEnableLoading());
		let resp = yield call(uploadImage, imgurls[i], imgFile, imgFile.type);
		//   dispatch(referralActions.sendMessageDisableLoading());
		let imageUrl = resp.url;
		console.log("IMAGE_URL", imageUrl);
		console.log("IMAGE_URL_VIDEO", imageVideoUrl);
		yield put(caseCreators.requestSendMessage(action.caseID, imageUrl));
	}
}

export function* getClinicians(action) {
	try {
		const response = yield call(getClinicianList);
		if (response.ok) {
			let clinicians = response.data.map((item, index) => {
				return {
					value: item._id,
					label: `${item.firstName + " " + item.lastName}`,
				};
			});
			yield put(caseCreators.successClinicianList(clinicians));
		} else {
			yield put(caseCreators.failureClinicianList());
		}
	} catch (error) {
		console.log("getclinician", error);
		yield put(caseCreators.failureClinicianList());
		showToast("Error fetching clinician list", "error");
	}
}
// export function* putReassignCase(action){
//     try {
//         const response = yield call(reassignCase,action.caseID,action.assignee.value)
//         if(response.ok){
//             yield put(caseCreators.successReassignCase(response.data))
//             showToast('Case has been succesfully reassigned','success')
//         } else {
//             yield put(caseCreators.failureReassignCase())
//             showToast('Failed to reassgin case','error')
//         }
//     } catch (error) {
//         yield put(caseCreators.failureReassignCase())
//         showToast('Failed to reassgin case','error')
//     }
// }

export function* getRubberStampQuestions(action) {
	try {
		const response = yield call(getRubberStamp, action.caseID);
		if (response.ok) {
			console.log(response);
			yield put(
				caseCreators.successRubberStampQuestions(response.data.result)
			);
		} else {
			yield put(caseCreators.failureRubberStampQuestions());
			//showToast('Failed to fetch rubber stamp questions','error')
		}
	} catch (error) {
		yield put(caseCreators.failureRubberStampQuestions());
		showToast("Failed to fetch triage questions.", "error");
	}
}

export function* submitRubberStampForm(action) {
	try {
		const response = yield call(
			putRubberStamp,
			action.caseID,
			action.rubberStamp
		);
		if (response.ok) {
			yield put(caseCreators.successRubberStampForm());
			showToast("Case details have been updated.", "success");
			action.history.push({
				pathname: "/my-referral",
			});
		} else {
			yield put(caseCreators.failureRubberStampForm());
			showToast("Failed to triage.", "error");
		}
	} catch (error) {
		yield put(caseCreators.failureRubberStampForm());
		showToast("Failed to triage.", "error");
	}
}



function* selectedCaseDetailsaga() {
	yield takeLeading(caseTypes.REQUEST_CASE_DETAILS, getCaseDetails);//takeLatest -> takeLeading test 
	yield takeLatest(caseTypes.DOWNLOAD_IMAGES, downloadImages);
	yield takeEvery(caseTypes.UPDATE_CASE_DETAILS, updateCaseDetails);
	yield takeLeading(caseTypes.REQUEST_GET_MESSAGE, getMessages);//takeEvery -> takeLeading test
	yield takeEvery(caseTypes.REQUEST_SEND_MESSAGE, sendMessages);
	yield takeEvery(caseTypes.REQUEST_SEND_IMG, sendImageMessages);
	//yield takeLatest(caseTypes.REASSIGN_CASE, putReassignCase);
	// yield takeLatest(caseTypes.REQUEST_CLINICIAN_LIST, getClinicians)
	yield takeLatest(
		caseTypes.REQUEST_RUBBER_STAMP_QUESTIONS,
		getRubberStampQuestions
	);
	yield takeLatest(caseTypes.SUBMIT_RUBBER_STAMP_FORM, submitRubberStampForm);
	
}

export default selectedCaseDetailsaga;
