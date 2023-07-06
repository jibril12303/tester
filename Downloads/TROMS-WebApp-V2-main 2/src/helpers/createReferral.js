import _ from "lodash"

export const getrheu2FileFields= (summary)=>{

    Object.filter = (obj, predicate) => 
    Object.keys(obj)
          .filter( key => predicate(obj[key]) )
          .reduce( (res, key) => (res[key] = obj[key], res), {} );

    let rheuInves2screenObj = _.find(summary,(i)=>i?.currentQuestion?.answers?.type == 'rheuInves2') || {};
    let rheuInves2screenIndex = _.findIndex(summary, (i) => i?.currentQuestion?.answers?.type == 'rheuInves2');

    let fileFields = Object.filter(rheuInves2screenObj?.answer, i => i.hasOwnProperty('file'));

    return fileFields || {};
}

export const getrheu3FileFields= (summary)=>{

    Object.filter = (obj, predicate) => 
    Object.keys(obj)
          .filter( key => predicate(obj[key]) )
          .reduce( (res, key) => (res[key] = obj[key], res), {} );

    let rheuInves3screenObj = _.find(summary,(i)=>i?.currentQuestion?.answers?.type == 'rheuInves3') || {};
    let rheuInves3screenIndex = _.findIndex(summary, (i) => i?.currentQuestion?.answers?.type == 'rheuInves3');

    let fileFields = Object.filter(rheuInves3screenObj?.answer, i => i.hasOwnProperty('file'));

    return fileFields || {};
}