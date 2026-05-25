import { LoaderCircle } from "lucide-react";

export function AdminLoading() {
  return (
    <div className="page-shell admin-shell">
      <div className="background-grid" />
      <div className="admin-loading">
        <LoaderCircle className="spin" size={20} />
        <span>Проверяю сессию администратора</span>
      </div>
    </div>
  );
}
