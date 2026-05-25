import { FormEvent } from "react";
import { LoginFormState } from "../../../../entities/session/model/types";

type AdminAuthCardProps = {
  loginForm: LoginFormState;
  loginState: "idle" | "sending" | "error";
  onLogin: (event: FormEvent<HTMLFormElement>) => void;
  onLoginFormChange: (form: LoginFormState) => void;
};

export function AdminAuthCard({ loginForm, loginState, onLogin, onLoginFormChange }: AdminAuthCardProps) {
  return (
    <div className="page-shell admin-shell">
      <div className="background-grid" />
      <main className="container admin-main">
        <section className="admin-auth-card">
          <h1>Admin вход в PotenCore</h1>
          <p>
            Для MVP создана временная учетка. По умолчанию логин и пароль уже подставлены: <strong>admin / admin</strong>.
          </p>

          <form className="admin-form" onSubmit={onLogin}>
            <label>
              Логин
              <input
                value={loginForm.username}
                onChange={(event) => onLoginFormChange({ ...loginForm, username: event.target.value })}
                required
              />
            </label>
            <label>
              Пароль
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => onLoginFormChange({ ...loginForm, password: event.target.value })}
                required
              />
            </label>
            <button className="button button-primary full-width" type="submit" disabled={loginState === "sending"}>
              {loginState === "sending" ? "Входим..." : "Войти в админку"}
            </button>
            {loginState === "error" && <p className="form-message error">Неверный логин или пароль.</p>}
          </form>
        </section>
      </main>
    </div>
  );
}
