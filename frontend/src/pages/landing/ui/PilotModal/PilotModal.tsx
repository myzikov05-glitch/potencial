import { useEffect, useId } from "react";
import { usePilotModalForm } from "./usePilotModalForm";
import "./PilotModal.css";

type PilotModalProps = {
  apiBaseUrl: string;
  isOpen: boolean;
  onClose: () => void;
};

const SUCCESS_CLOSE_DELAY_MS = 1500;

export function PilotModal({ apiBaseUrl, isOpen, onClose }: PilotModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const {
    form,
    nameError,
    submitState,
    handleConsentChange,
    handleNameChange,
    handlePhoneChange,
    handleSubmit,
    resetForm
  } = usePilotModalForm(apiBaseUrl);

  function handleClose() {
    resetForm();
    onClose();
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    document.body.classList.add("pilot-modal-open");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("pilot-modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (submitState !== "success") {
      return;
    }

    const closeTimer = window.setTimeout(() => {
      handleClose();
    }, SUCCESS_CLOSE_DELAY_MS);

    return () => window.clearTimeout(closeTimer);
  }, [submitState]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="pilot-modal-backdrop" onMouseDown={handleClose}>
      <section
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className="pilot-modal"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <button aria-label="Закрыть окно" className="pilot-modal-close" onClick={handleClose} type="button">
          ×
        </button>

        <div className="pilot-modal-heading">
          <h2 id={titleId}>Начните пилотную версию</h2>
          <p id={descriptionId}>Оставьте имя и телефон - мы свяжемся с Вами как можно скорее, чтобы обсудить все детали</p>
        </div>

        <form className="pilot-modal-form" onSubmit={handleSubmit}>
          <label className="pilot-modal-field">
            <span>Имя</span>
            <input
              autoFocus
              maxLength={120}
              minLength={2}
              onChange={(event) => handleNameChange(event.target.value)}
              pattern="[А-Яа-яЁё\s-]+"
              placeholder="Анна"
              required
              value={form.name}
            />
            {nameError && <p className="pilot-modal-field-error">{nameError}</p>}
          </label>

          <label className="pilot-modal-field">
            <span>Телефон</span>
            <input
              inputMode="tel"
              maxLength={16}
              onChange={(event) => handlePhoneChange(event.target.value)}
              placeholder="+7 999 123-45-67"
              required
              type="tel"
              value={form.phone}
            />
          </label>

          <label className="pilot-modal-consent">
            <input
              checked={form.consent}
              onChange={(event) => handleConsentChange(event.target.checked)}
              required
              type="checkbox"
            />
            <span>Я согласен на обработку моих контактов для связи</span>
          </label>

          <button className="pilot-modal-submit" disabled={submitState === "sending"} type="submit">
            {submitState === "sending" ? "Отправляем..." : "Отправить"}
          </button>

          {submitState === "success" && <p className="pilot-modal-status success">Заявка отправлена. Скоро свяжемся с Вами.</p>}
          {submitState === "error" && <p className="pilot-modal-status error">Не удалось отправить заявку. Попробуйте еще раз.</p>}

          <a className="pilot-modal-policy" href="#privacy">
            Политика конфиденциальности
          </a>
        </form>
      </section>
    </div>
  );
}
