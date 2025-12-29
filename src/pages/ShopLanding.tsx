import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import './Categories.css';

const ShopLanding = () => {
  const navigate = useNavigate();

  const handleDepartmentClick = (department: 'men' | 'women' | 'kids') => {
    navigate(`/categories?department=${department}`);
  };

  return (
    <Layout>
      <section className="categories-section">
        <h2 className="categories-title">Shop by Department</h2>
        <div className="categories-grid">
          <button onClick={() => handleDepartmentClick('men')}>Men</button>
          <button onClick={() => handleDepartmentClick('women')}>Women</button>
          <button onClick={() => handleDepartmentClick('kids')}>Kids</button>
        </div>
      </section>
    </Layout>
  );
};

export default ShopLanding;
