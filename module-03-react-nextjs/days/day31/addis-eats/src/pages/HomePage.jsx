import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <section className="home-page">
      <h1>Welcome to Addis Eats</h1>
      <p>Discover delicious Ethiopian dishes and place your order with ease.</p>
      <Link to="/menu" className="primary-link">Explore the menu</Link>
    </section>
  );
}

export default HomePage;
