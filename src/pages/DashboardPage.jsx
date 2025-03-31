import { Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import DatosCuriosos from '../components/DatosCuriosos/DatosCuriosos';
import GenerateCats from '../components/GenerateCats/GenerateCats';

const DashboardPage = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {

    const header = document.querySelector('.responsive-header');
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const contentHeight = windowHeight - headerHeight - 32;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: `${contentHeight}px` }}>
      <Row gutter={[16, 16]} style={{ width: '100%', height: '95%' }}>
        <Col xs={24} md={10} lg={7} style={{ height: '100%' }}>
          <DatosCuriosos />
        </Col>
        <Col xs={24} md={14} lg={17} style={{ height: '100%' }}>
          <GenerateCats />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
