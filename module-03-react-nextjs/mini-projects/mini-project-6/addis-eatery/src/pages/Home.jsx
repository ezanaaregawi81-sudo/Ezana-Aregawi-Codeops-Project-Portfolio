import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="page menu home-page">
      <p className="eyebrow">Fresh from Addis</p>
      <h1>Good food, made to share.</h1>
      <p>Browse comforting Ethiopian dishes, build your order, and we will bring it to your door.</p>
      <Link className="primary-link" to="/menu">Browse the menu</Link>
    </section>
  );
}