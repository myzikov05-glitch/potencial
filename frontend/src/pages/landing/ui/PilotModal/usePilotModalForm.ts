import { FormEvent, useState } from "react";
import { formatCyrillicName, formatPhone } from "./formatters";
import { PilotFormState, PilotSubmitState } from "./types";

const initialFormState: PilotFormState = {
  name: "",
  phone: "",
  consent: false
};

export function usePilotModalForm(apiBaseUrl: string) {
  const [form, setForm] = useState<PilotFormState>(initialFormState);
  const [nameError, setNameError] = useState("");
  const [submitState, setSubmitState] = useState<PilotSubmitState>("idle");

  function resetForm() {
    setForm(initialFormState);
    setNameError("");
    setSubmitState("idle");
  }

  function handleNameChange(value: string) {
    const formattedValue = formatCyrillicName(value);

    setNameError(value !== formattedValue ? "Можно вводить только кириллицу" : "");
    setForm((state) => ({ ...state, name: formattedValue }));
  }

  function handlePhoneChange(value: string) {
    setForm((state) => ({ ...state, phone: formatPhone(value) }));
  }

  function handleConsentChange(value: boolean) {
    setForm((state) => ({ ...state, consent: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.consent || !form.name.trim() || !form.phone.trim()) {
      return;
    }

    setSubmitState("sending");

    try {
      const phoneDigits = form.phone.replace(/\D/g, "");
      const fallbackEmail = `${phoneDigits || Date.now()}@pilot.potencore.local`;
      const response = await fetch(`${apiBaseUrl}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: fallbackEmail,
          team_name: "Пилотная версия",
          team_size: 1,
          message: `Телефон: ${form.phone.trim()}`
        })
      });

      if (!response.ok) {
        throw new Error("lead request failed");
      }

      setSubmitState("success");
      setForm(initialFormState);
      setNameError("");
    } catch {
      setSubmitState("error");
    }
  }

  return {
    form,
    nameError,
    submitState,
    handleConsentChange,
    handleNameChange,
    handlePhoneChange,
    handleSubmit,
    resetForm
  };
}
