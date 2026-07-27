export type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

export type ContactFormStatus = "idle" | "sending" | "success" | "error";

export const initialContactFormState: ContactFormState = {
  name: "",
  phone: "",
  email: "",
  service: "",
  message: "",
};

export const contactServiceOptions = [
  "Web Development",
  "Mobile App Development",
  "Backend Systems",
  "Maintenance & Support",
  "Emergency Restoration",
];
