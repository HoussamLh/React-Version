import type React from "react";
import { useMemo,useState } from "react";
import type { 
    AdminComparisonRow,
    AdminComparisonRowFormValues,
    AdminPricingStatus 
} from "../types/pricingCms.types";

const defaultValues:AdminComparisonRowFormValues={
    feature:"",
    standard:"",
    advanced:"",
    premium:"",
    status:"draft",
    sortOrder:0
};

export const useAdminComparisonRowForm=(
    initial?:AdminComparisonRow|
    null,
    onSubmit?:(values:AdminComparisonRowFormValues)=>Promise<void>)=>{
const initialValues=useMemo(()=>initial?{
            feature:initial.feature,
            standard:initial.standard,
            advanced:initial.advanced,
            premium:initial.premium,
            status:initial.status,
            sortOrder:initial.sortOrder
        }:defaultValues,[initial]);
        
const [feature,setFeature]=useState(initialValues.feature),
[standard,setStandard]=useState(initialValues.standard),
[advanced,setAdvanced]=useState(initialValues.advanced),
[premium,setPremium]=useState(initialValues.premium),
[status,setStatus]=useState<AdminPricingStatus>(initialValues.status),
[sortOrder,setSortOrder]=useState(String(initialValues.sortOrder)),
[validationError,setValidationError]=useState<string|null>(null);

const handleSubmit=async(event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    if(!feature.trim()){setValidationError("Feature name is required.");
        return;
    }
    if(!standard.trim()){setValidationError("Standard value is required.");
        return;
    }
    if(!advanced.trim()){
        setValidationError("Advanced value is required.");
        return;
    }
    if(!premium.trim()){
        setValidationError("Premium value is required.");
        return;
    }
    setValidationError(null);
    await onSubmit?.({feature:feature.trim(),
        standard:standard.trim(),
        advanced:advanced.trim(),
        premium:premium.trim(),
        status,
        sortOrder:Number(sortOrder)||0});
    };
return{
    feature,
    setFeature,
    standard,
    setStandard,
    advanced,
    setAdvanced,
    premium,
    setPremium,
    status,
    setStatus,
    sortOrder,
    setSortOrder,
    validationError,
    handleSubmit};
};
