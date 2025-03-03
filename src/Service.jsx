import React, { useEffect, useRef } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const servicesData = [
  {
    id: 43635,
    imgSrc: "http://sakuri.like-themes.com/wp-content/uploads/2024/12/menu_01-500x689.jpg",
    imgAlt: "",
    header: "Sushi Menu",
    subheader: "寿司と刺身",
    category: "sushi"
  },
  {
    id: 43637,
    imgSrc: "http://sakuri.like-themes.com/wp-content/uploads/2024/12/menu_02-500x689.jpg",
    imgAlt: "",
    header: "Soup & Ramen",
    subheader: "拉麺",
    category: "sushi"
  },
  {
    id: 43636,
    imgSrc: "http://sakuri.like-themes.com/wp-content/uploads/2024/12/menu_03-500x689.jpg",
    imgAlt: "",
    header: "Seafood",
    subheader: "シーフード",
    category: "sushi"
  },
  {
    id: 43634,
    imgSrc: "http://sakuri.like-themes.com/wp-content/uploads/2024/12/menu_04-500x689.jpg",
    imgAlt: "",
    header: "Drinks",
    subheader: "ドリンク",
    category: "sushi"
  },
];

const ServiceItem = ({ imgSrc, imgAlt, header, subheader, delayClass }) => (
  <Col xl={3} lg={3} md={6} sm={6} xs={12} className={`scroll-animation ${delayClass}`}>
    <Card className="mb-4 card-custom">
      <a href="/shop/">
        <Card.Img variant="top" src={imgSrc} alt={imgAlt} className="card-img-custom" />
      </a>
      <Card.Body>
        <Card.Title className="card-title-custom">
          <a href="/shop/">{header}</a>
        </Card.Title>
        <Card.Text className="card-text-custom">{subheader}</Card.Text>
      </Card.Body>
    </Card>
  </Col>
);

const Services = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    const elements = containerRef.current.querySelectorAll('.scroll-animation');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="container-custom">
      <h1 className='text-center'>Service</h1>
      <Container ref={containerRef}>
        <Row>
          {servicesData.map((service, index) => (
            <ServiceItem
              key={service.id}
              imgSrc={service.imgSrc}
              imgAlt={service.imgAlt}
              header={service.header}
              subheader={service.subheader}
              delayClass={`scroll-animation-delay-${index + 1}`}
            />
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Services;