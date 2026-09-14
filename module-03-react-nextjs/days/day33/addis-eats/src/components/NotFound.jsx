import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="empty-state">
      <h2>Page not found</h2>
      <Link to="/" className="primary-link">Back to home</Link>
    </section>
  );
}

export default NotFound;
