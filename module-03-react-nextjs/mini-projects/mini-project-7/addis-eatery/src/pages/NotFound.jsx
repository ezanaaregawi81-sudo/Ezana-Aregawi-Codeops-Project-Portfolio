import { Link } from "react-router-dom";

export default function NotFound() {
  return <section className="page menu"><h2>Page not found</h2><p>We could not find that page.</p><Link to="/menu">Return to the menu</Link></section>;
}