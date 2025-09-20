import { Button, Carousel, Image, Space } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {

  return (
    <div>
      <Space>
        <Link to='/domaincase'>
          <Button>domaincase</Button>
        </Link>
        <Link to='/test'>
          <Button>test</Button>
        </Link>

        <Link to='/componentdemo'>
          <Button>componentdemo</Button>
        </Link>
      </Space>
    </div>
  );
};

export default Home;
