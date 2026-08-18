import type React from "react";
import { useMemo, useState } from "react";
import type { 
    AdminMaintenancePlan, 
    AdminMaintenancePlanFormValues, 
    AdminPricingStatus 
} from "../types/pricingCms.types";
import { parseFeatureInput } from "../components/pricingForm.helpers";

const defaultValues: AdminMaintenancePlanFormValues={
    name:"",
    price:"",
    suffix:"/mo",
    description:"",
    features:[],
    ctaLabel:"Contact",
    ctaTo:"/contact",
    recommended:false,
    status:"draft",
    sortOrder:0
};
export const useAdminMaintenancePlanForm=(
    initialPlan?:AdminMaintenancePlan|null,
    onSubmit?:(values:AdminMaintenancePlanFormValues)=>Promise<void>)=>{ 
        const initialValues=useMemo(()=>initialPlan?{
            name:initialPlan.name,
            price:initialPlan.price,
            suffix:initialPlan.suffix,
            description:initialPlan.description,
            features:initialPlan.features,
            ctaLabel:initialPlan.ctaLabel,
            ctaTo:initialPlan.ctaTo,
            recommended:initialPlan.recommended,
            status:initialPlan.status,
            sortOrder:initialPlan.sortOrder
        }:defaultValues,[initialPlan]); 
        
const [name,setName]=useState(initialValues.name),
[price,setPrice]=useState(initialValues.price),
[suffix,setSuffix]=useState(initialValues.suffix),
[description,setDescription]=useState(initialValues.description),
[featuresInput,setFeaturesInput]=useState(initialValues.features.join(", ")),
[ctaLabel,setCtaLabel]=useState(initialValues.ctaLabel),
[ctaTo,setCtaTo]=useState(initialValues.ctaTo),
[recommended,setRecommended]=useState(initialValues.recommended),
[status,setStatus]=useState<AdminPricingStatus>(initialValues.status),
[sortOrder,setSortOrder]=useState(String(initialValues.sortOrder)),
[validationError,setValidationError]=useState<string|null>(null); 

const handleSubmit=async(event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    if(!name.trim()){
        setValidationError("Maintenance plan name is required.");
        return;
    }
    if(!price.trim()){setValidationError("Maintenance plan price is required.");
            return;
    }
    if(!suffix.trim()){
        setValidationError("Suffix is required.");
        return;
    }
    if(!description.trim()){
        setValidationError("Description is required.");
        return;
    }
    setValidationError(null);
    await onSubmit?.({
        name:name.trim(),
        price:price.trim(),
        suffix:suffix.trim(),
        description:description.trim(),
        features:parseFeatureInput(featuresInput),
        ctaLabel:ctaLabel.trim()||"Contact",
        ctaTo:ctaTo.trim()||"/contact",
        recommended,
        status,
        sortOrder:Number(sortOrder)||0});
    }; 
    return {
        name,
        setName,
        price,
        setPrice,
        suffix,
        setSuffix,
        description,
        setDescription,
        featuresInput,
        setFeaturesInput,
        ctaLabel,
        setCtaLabel,
        ctaTo,
        setCtaTo,
        recommended,
        setRecommended,
        status,
        setStatus,
        sortOrder,
        setSortOrder,
        validationError,
        handleSubmit};
};
