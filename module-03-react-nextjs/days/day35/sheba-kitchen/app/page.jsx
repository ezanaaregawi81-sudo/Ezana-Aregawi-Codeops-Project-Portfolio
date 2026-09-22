import Link from 'next/link';

export default function RootPage() {
  return (
    <div className="sk-shell">
      <div className="sk-status">
        <span className="sk-kicker">Welcome</span>
        <h1 className="sk-title">Sheba Kitchen</h1>
        <p className="sk-subtitle" style={{ maxWidth: '40ch' }}>
          Ethiopian home cooking, delivered. Browse the menu, build a basket, and check out in minutes.
        </p>
        <div className="sk-actions">
          <Link href="/home" className="sk-btn sk-btn--solid">
            Get started
          </Link>
          <Link href="/menu" className="sk-btn sk-btn--outline">
            Browse the menu
          </Link>
        </div>
      </div>
    </div>
  );
}
