export const renderClinicalField  = (field)=>{
    const data = field.find((item=>item.screenType == "rheuClini"))
    return data;
  }
export const renderInvestigateField  = (field)=>{
    const data = field.find((item=>item.screenType == "rheuInves"))
    return data;
  }

export const renderInvestigateField2  = (field)=>{
    const data = field.find((item=>item.screenType == "rheuInves2"))
    return data;
  }

export const renderGiInvestigateField  = (field)=>{
    const data = field.find((item=>item.screenType == "rheuInves3"))
    return data;
  }

export const renderTreatMentField  = (field)=>{
    const data = field.find((item=>item.screenType == "rheuTreat"))
    return data;
  }
export const renderVitalsField  = (field)=>{
    const data = field.find((item=>item.screenType == "rheuVital"))
    return data;
  }