import { Brand } from "./Brand.jsx";

const navItems = [
  ["#sdr", "SDR"],
  ["#modes", "Режими"],
  ["#capabilities", "Можливості"],
  ["#faq", "FAQ"],
];

export function Header() {
  return (
    <header className="site-header">
      <Brand />
      <nav className="nav" aria-label="Навігація сторінки">
        {navItems.map(([href, label]) => (
          <a href={href} key={href}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
