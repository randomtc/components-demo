import { Button, Carousel, Image } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {

  return (
    <div>
      <Link to='/domaincase'>
        <Button>domaincase</Button>
      </Link>
    </div>
  );
};

export default Home;
