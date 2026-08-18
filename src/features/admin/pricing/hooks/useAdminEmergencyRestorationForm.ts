import type React from "react";
import { useMemo,useState } from "react";
import type { 
    AdminEmergencyRestoration, 
    AdminEmergencyRestorationFormValues, 
    AdminPricingStatus 
} from "../types/pricingCms.types";

const defaultValues:AdminEmergencyRestorationFormValues={
    title:"",
    price:"",
    suffix:"one-time",
    text:"",
    status:"draft"
};

export const useAdminEmergencyRestorationForm=(
    initial?:AdminEmergencyRestoration|null,
    onSubmit?:(values:AdminEmergencyRestorationFormValues)=>Promise<void>)=>{
        const initialValues=useMemo(()=>initial?{
            title:initial.title,
            price:initial.price,
            suffix:initial.suffix,
            text:initial.text,
            status:initial.status}:defaultValues,
            [initial]
        );const [
            title,
            setTitle]=useState(initialValues.title),
            [price,setPrice]=useState(initialValues.price),
            [suffix,setSuffix]=useState(initialValues.suffix),
            [text,setText]=useState(initialValues.text),
            [status,setStatus]=useState<AdminPricingStatus>(
            initialValues.status),
            [validationError,
            setValidationError]=useState<string|null>(null);
            
const handleSubmit=async(event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    if(!title.trim()){
        setValidationError("Emergency restoration title is required.");
        return;}
    if(!price.trim()){
            setValidationError("Emergency restoration price is required.");
        return;
    }
    if(!suffix.trim()){
        setValidationError("Suffix is required.");
        return;
    }
    if(!text.trim()){
        setValidationError("Text is required.");
        return;
    }
    setValidationError(null);
    await onSubmit?.({
        title:title.trim(),
        price:price.trim(),
        suffix:suffix.trim(),
        text:text.trim(),
        status});
    };
return{
    title,setTitle,
    price,setPrice,
    suffix,setSuffix,
    text,setText,
    status,setStatus,
    validationError,
    handleSubmit};
};
