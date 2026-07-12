export { AdminServiceForm } from "./AdminServiceForm";
export { AdminServicesPage } from "./AdminServicesPage";

export type {
  AdminService,
  AdminServiceFormValues,
  ServiceAccent,
  ServiceIcon,
  ServiceSpan,
  ServiceStatus,
} from "./servicesCms.types";

export {
  createAdminService,
  deleteAdminService,
  getAdminServices,
  updateAdminService,
} from "./servicesCms.service";
