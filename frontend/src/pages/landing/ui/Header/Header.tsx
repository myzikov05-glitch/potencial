import "./Header.css";

export function Header() {
  return (
    <header className="container site-header">
      <a className="brand" href="#top" aria-label="PotenCore">
        <span className="brand-accent">Poten</span>Core
      </a>
      <nav className="site-nav">
        <a href="/admin">Войти</a>
      </nav>
    </header>
  );
}
