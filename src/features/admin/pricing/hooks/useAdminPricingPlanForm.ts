import type React from "react";
import { useMemo, useState } from "react";
import type { 
  AdminPricingPlan, 
  AdminPricingPlanFormValues, 
  AdminPricingStatus 
} from "../types/pricingCms.types";
import { 
  getNullableTextValue, 
  parseFeatureInput 
} from "../components/pricingForm.helpers";

const defaultValues: AdminPricingPlanFormValues = { 
  name:"", 
  label:"", 
  price:"", 
  suffix:null, 
  description:"", 
  features:[], 
  ctaLabel:"Contact", 
  ctaTo:"/contact", 
  recommended:false, 
  status:"draft", 
  sortOrder:0 
};

  export const useAdminPricingPlanForm = (
    initialPlan?: AdminPricingPlan | null, 
    onSubmit?: (values: AdminPricingPlanFormValues)=>Promise<void>) => {
  const initialValues = useMemo(() => initialPlan ? { 
    name:initialPlan.name,
    label:initialPlan.label,
    price:initialPlan.price,
    suffix:initialPlan.suffix,
    description:initialPlan.description,
    features:initialPlan.features,
    ctaLabel:initialPlan.ctaLabel,
    ctaTo:initialPlan.ctaTo,
    recommended:initialPlan.recommended,
    status:initialPlan.status,
    sortOrder:initialPlan.sortOrder } : defaultValues, 
    [initialPlan]
  );

  const [name,setName]=useState(initialValues.name); 
  const [label,setLabel]=useState(initialValues.label); 
  const [price,setPrice]=useState(initialValues.price); 
  const [suffix,setSuffix]=useState(initialValues.suffix??""); 
  const [description,setDescription]=useState(initialValues.description); 
  const [featuresInput,setFeaturesInput]=useState(initialValues.features.join(", ")); 
  const [ctaLabel,setCtaLabel]=useState(initialValues.ctaLabel); 
  const [ctaTo,setCtaTo]=useState(initialValues.ctaTo); 
  const [recommended,setRecommended]=useState(initialValues.recommended); 
  const [status,setStatus]=useState<AdminPricingStatus>(initialValues.status); 
  const [sortOrder,setSortOrder]=useState(String(initialValues.sortOrder)); 
  const [validationError,setValidationError]=useState<string|null>(null);

  const handleSubmit=async(event:React.FormEvent<HTMLFormElement>)=>{ 
    event.preventDefault(); 
    if(!name.trim()){setValidationError("Plan name is required.");return;} 
    if(!label.trim()){setValidationError("Plan label is required.");return;} 
    if(!price.trim()){setValidationError("Plan price is required.");return;} 
    if(!description.trim()){setValidationError("Description is required.");return;} 
    setValidationError(null); 
    await onSubmit?.({
      name:name.trim(),
      label:label.trim(),
      price:price.trim(),
      suffix:getNullableTextValue(suffix),
      description:description.trim(),
      features:parseFeatureInput(featuresInput),
      ctaLabel:ctaLabel.trim()||"Contact",
      ctaTo:ctaTo.trim()||"/contact",
      recommended,
      status,
      sortOrder:Number(sortOrder)||0}); 
    };
  return {
    name,setName,
    label,setLabel,
    price,setPrice,
    suffix,setSuffix,
    description,setDescription,
    featuresInput,setFeaturesInput,
    ctaLabel,setCtaLabel,
    ctaTo,setCtaTo,
    recommended,setRecommended,
    status,setStatus,
    sortOrder,setSortOrder,
    validationError,handleSubmit
  };
};
