export type PilotFormState = {
  name: string;
  phone: string;
  consent: boolean;
};

export type PilotSubmitState = "idle" | "sending" | "success" | "error";
