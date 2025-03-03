import React, { useContext, useEffect, useState } from 'react';
import { Container, Nav, Navbar, Dropdown, Row, Col, Button, Card, Offcanvas, Image, Modal } from 'react-bootstrap';
import { LanguageContext } from './LanguageContext';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import { motion } from 'framer-motion';
import SplitText from "./SplitText";
import { useSpring, animated } from '@react-spring/web';
import { CSSTransition } from "react-transition-group";


const CollapsibleExample = () => {
  const { language, toggleLanguage } = useContext(LanguageContext);




  const foodItems = [
    { id: 1, name: "Veg Pizza", image: "https://22271054.fs1.hubspotusercontent-na1.net/hub/22271054/hubfs/product-3-4.png?width=435&height=420&name=product-3-4.png" },
    { id: 2, name: "Cheese Pizza", image: "https://22271054.fs1.hubspotusercontent-na1.net/hub/22271054/hubfs/product-2-4.png?width=435&height=420&name=product-2-4.png" },
    { id: 3, name: "Pepperoni Pizza", image: "https://22271054.fs1.hubspotusercontent-na1.net/hub/22271054/hubfs/product-1-Sep-10-2022-05-35-19-69-PM.png?width=435&height=420&name=product-1-Sep-10-2022-05-35-19-69-PM.png" },
    { id: 4, name: "Margherita Pizza", image: "https://themes.templatescoder.com/pizzon/html/demo/1-2/01-Modern/images/pizza-1.png" },
    { id: 5, name: "Tandoori Chicken", image: "https://themes.templatescoder.com/pizzon/html/demo/1-2/01-Modern/images/pizza-2.png" },
    { id: 6, name: "Mexican Pizza", image: "https://themes.templatescoder.com/pizzon/html/demo/1-2/01-Modern/images/pizza-3.png" },
    { id: 7, name: "BBQ Pizza", image: "https://themes.templatescoder.com/pizzon/html/demo/1-2/01-Modern/images/pizza-4.png" },
    { id: 8, name: "Chicken Pizza", image: "https://themes.templatescoder.com/pizzon/html/demo/1-2/01-Modern/images/banner-img-bottom.png" },
    { id: 9, name: "Double cheese", image: "https://themes.templatescoder.com/pizzon/html/demo/1-2/01-Modern/images/banner-img.png" },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 768, // Tablet
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480, // Mobile
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const [chefs, setChefs] = useState([

    { id: 1, name: 'William G. Berrier', description: 'Executive Chef', image: 'https://22271054.fs1.hubspotusercontent-na1.net/hub/22271054/hubfs/chef-1-Sep-10-2022-05-42-37-78-PM.png?width=507&height=570&name=chef-1-Sep-10-2022-05-42-37-78-PM.png' },
    { id: 2, name: 'Rickie B. Delacruz', description: 'Senior Chef', image: 'https://22271054.fs1.hubspotusercontent-na1.net/hub/22271054/hubfs/chef-2-4.png?width=507&height=570&name=chef-2-4.png' },
    { id: 3, name: 'Bernardo B.Casta', description: 'Executive Chef', image: 'https://22271054.fs1.hubspotusercontent-na1.net/hub/22271054/hubfs/chef-3-4.png?width=507&height=570&name=chef-3-4.png' },
  ]);



  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };


  const [cartItems, setCartItems] = useState([]);
  const [show, setShow] = useState(false);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);


  const offcanvasAnimation = useSpring({
    opacity: show ? 1 : 0,
    transform: show ? 'translateX(0%)' : 'translateX(100%)',
    config: { tension: 300, friction: 20 },
  });

  
  const fetchCartItems = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/cart");
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

 
  const addToCart = async (dishName, price, image) => {
    try {
      await axios.post("http://localhost:8080/api/cart", {
        dishName,
        quantity: 1,
        price,
        image, 
      });
      fetchCartItems();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };


  const incrementQuantity = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/cart/${id}/increment`);
      fetchCartItems(); 
    } catch (error) {
      console.error("Error incrementing quantity:", error);
    }
  };

  
  const decrementQuantity = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/cart/${id}/decrement`);
      fetchCartItems();
    } catch (error) {
      console.error("Error decrementing quantity:", error);
    }
  };

 
  const deleteCartItem = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/cart/${id}`);
      fetchCartItems(); 
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  
  
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState({
      username: "",
      password: "",
      action: "",
    });
  
    const handleLogin = async () => {
      try {
        const response = await axios.post("http://localhost:8080/api/login", user);
        alert(response.data);
        setShowModal(false); 
      } catch (error) {
        console.error("Error during login/signup:", error);
        alert("check username or password. Please try again.");
      }
    };
  

  
  const handleCheckout = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/checkout", user);
      alert(response.data); 
      fetchCartItems(); 
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };


  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/dishes");
        setOriginalProducts(response.data); 
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    };
    fetchDishes();
  }, []);

  const handleCategoryClick = (category) => {
    if (category === "all") {
      
      setFilteredProducts(originalProducts);
    } else {
     
      const filtered = originalProducts.filter((dish) => dish.category === category);
      setFilteredProducts(filtered);
    }
  };

  const testimonialsData = [
    {
      id: 1,
      imgSrc: "https://themes.templatescoder.com/pizzon/html/demo/1-2/01-Modern/images/client-3.jpg",
      altText: "Johan Doe",
      name: "Johan Doe",
      desc: "“Lorem Ipsum is simply dummy text of the print book. It has survived not only five centuries, but also the leap”",
      rating: 5
    },
    {
      id: 2,
      imgSrc: "https://themes.templatescoder.com/pizzon/html/demo/1-2/01-Modern/images/client-2.jpg",
      altText: "Alex Saanu",
      name: "Alex Saanu",
      desc: "“Lorem Ipsum is simply dummy text of the print book. It has survived not only five centuries, but also the leap”",
      rating: 5
    },
    {
      id: 3,
      imgSrc: "https://themes.templatescoder.com/pizzon/html/demo/1-2/01-Modern/images/client-4.jpg",
      altText: "Jona Leoner",
      name: "Jona Leoner",
      desc: "“Lorem Ipsum is simply dummy text of the print book. It has survived not only five centuries, but also the leap”",
      rating: 5
    },
    {
      id: 4,
      imgSrc: "https://themes.templatescoder.com/pizzon/html/demo/1-2/01-Modern/images/client-1.jpg",
      altText: "Takar Bowa",
      name: "Takar Bowa",
      desc: "“Lorem Ipsum is simply dummy text of the print book. It has survived not only five centuries, but also the leap”",
      rating: 5
    },
    {
      id: 5,
      imgSrc: "https://themes.templatescoder.com/pizzon/html/demo/1-2/01-Modern/images/blog-author.png",
      altText: "Chris Evans",
      name: "Chris Evans",
      desc: "“Lorem Ipsum is simply dummy text of the print book. It has survived not only five centuries, but also the leap”",
      rating: 5
    },
    {
      id: 6,
      imgSrc: "https://i.pinimg.com/236x/03/50/6c/03506cf1ba0b9ae8c1ca394029ce7029.jpg",
      altText: "Emma Watson",
      name: "Emma Watson",
      desc: "“Lorem Ipsum is simply dummy text of the print book. It has survived not only five centuries, but also the leap”",
      rating: 5
    }
  ];




  return (
    <>

      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary navbar custom-navbar m-0 p-0" sticky="top">
        <Container className="nav p-0 py-3 py-md-0">
          <Navbar.Brand href="#home" className="mx-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 128 128"><path fill="#ffe082" d="M69.08 10.59c-12.87-2.27-20.67 5.35-21.77 17.72c-.24 2.68-2.38 5.04-4.01 7.15c-5.47 7.11-11.08 14.55-16.82 21.49c-4.98 6.01-9.25 12.53-13.63 18.97C3.74 89.38.14 99.8 5.22 115.79c1.11 3.52 3.65 9.27 8.22 9.05c4.57-.21 5.29-6.02 6.12-9.33c.42-1.7.92-3.72 2.32-4.94c.75-.65 1.38-.44 2.22-.67c.85-.23.92-.4 1.59-.89c1.87-1.37 2.38-.71 3.82.7c2.07 2.03 5.5 1.87 8.12 1.35c1.53-.3 2.03-.63 2.94-1.77c.98-1.24 2.48-2.05 3.35-3.37c.9-1.36.93-1.84 2.59-2.39c3.54-1.17 4.51 1.29 7.04 3.02c2.48 1.7 5.85 2.36 8.78 1.68c1.42-.33 1.83-.72 2.53-1.88c.83-1.39 1.91-2.33 2.91-3.59c1.1-1.4 1.98-2.25 3.49-3.2c1.37-.86 2.6-1.24 4.15-1.73c2.84-.9 5.58-2.15 8.4-3.09c3.67-1.23 7.34-2.46 11.01-3.7c7.22-2.46 14.42-4.97 21.56-7.62c4.08-1.51 8.65-2.71 9.71-7.47c.36-1.61.63-3.24.8-4.88c1.87-17.84-8.7-33.67-22.34-44.31c-6.9-5.38-14.68-9.7-22.9-12.74c-3.15-1.15-7.73-2.57-12.57-3.43" /><path fill="#757f3f" d="M52.39 81.54c-.42 0-.82-.02-1.23-.05c-3.94-.38-7-3.88-7.13-8.16c-.07-2.51 1.08-4.84 3.16-6.38c.52-.39 1.38-.96 2.34-1.32c-.19-.45-.36-.96-.5-1.52c-.38-1.54-.26-3.04.36-4.35c1.03-2.19 3.25-3.68 6.25-4.24c.63-.11 1.32-.17 2.03-.17c1.32 0 4.61.24 6.6 2.45c.68.75 1.12 1.64 1.31 2.63c3.27-.77 6.91.72 8.63 3.59c2.07 3.46 1.76 8.68-2.01 10.95c-1.68 1.01-3.5 1.47-5.75 1.47c-.37 0-.62.02-.89.04c-1.02.04-2.02.04-2.81-.14a4 4 0 0 1-.83-.3c-.02.04-.04.07-.06.11c-.91 1.45-2.09 3.06-4.44 3.97c-.2.08-.39.19-.57.3c-.45.25-.91.5-1.41.66c-.91.31-1.93.46-3.05.46m-1.18-11.63c-.04.03-.64.32-1.25.77c-.86.63-1.31 1.53-1.29 2.53c.04 1.68 1.16 3.49 2.93 3.67c.84.07 1.73.03 2.36-.18c.22-.07.41-.2.61-.31c.38-.22.76-.42 1.17-.58c.86-.33 1.38-.83 2.2-2.14c.03-.06.06-.14.1-.23c.22-.5.59-1.35 1.47-1.93c.6-.4 1.24-.61 1.92-.61c1.05 0 1.82.51 2.27.8c.08.05.16.12.25.15c.03 0 .24.02.5.02c.28 0 .58-.02.87-.04c.35-.02.7-.04 1.02-.04c1.51 0 2.52-.24 3.47-.81c1.29-.78 1.29-3.14.43-4.58c-.8-1.34-2.68-1.92-4.14-1.29l-.08.08c-.57.4-1.56 1.05-2.73.9a2.75 2.75 0 0 1-1.85-1.1c-.77-1.05-.56-2.25-.44-2.97l.03-.25c.06-.58-.12-.79-.21-.88c-.49-.54-1.76-.91-3.16-.91c-.43 0-.84.04-1.19.1c-1.45.26-2.53.88-2.89 1.65c-.2.42-.14.92-.05 1.27c.18.75.35.98.36.99c.4.24 1.15.74 1.56 1.78c.58 1.45.23 2.46-.17 3.05c-.32.47-1.07 1.25-2.56 1.25c-.37 0-.81-.05-1.21-.12c-.11-.01-.21-.03-.3-.04" /><path fill="#ed6c30" d="M16.75 69.45c.25-2.4 1.77-4.86 5.14-7.03c2.43-1.56 4.94-2.12 7.81-1.72c6.54.9 12.61 4.41 10.73 12.13c-.78 3.21-4.89 5.73-7.78 6.76c-3.52 1.26-7.44 1.11-10.81-.52c-1.52-.73-3.52-2.11-4.41-3.57c-.93-1.53-.87-4.31-.68-6.05" /><path fill="#fff" d="m34.8 66.86l-1.45 2.31l3.48.29l1.16-2.6l-1.74-1.74zm-10.27 2.89l-2.73.16l1.78 3l2.8-.57l.41-2.42zm5.25 5.04L27 74.78l2.02 3.33l2.83-.42l.25-2.57zm7.75-4.19l-.43 1.52l1.81.07l.07-1.45zm-6.64-.06s-1.3 1.23-1.09 1.3c.22.07 2.03.29 2.03.29l.72-1.16zm-9.11 3.32s-1.66 1.74-1.23 1.74s1.67-.22 1.67-.22l.72-1.16zm7.92-11.03s-3.02 3.15-2.23 3.15s3.02-.39 3.02-.39l1.31-2.1z" /><path fill="#ed6c30" d="M41.05 41.3c-.15-2.42.95-5.09 3.92-7.79c2.14-1.94 4.53-2.9 7.42-2.98c6.59-.18 13.16 2.28 12.58 10.21c-.23 3.3-3.88 6.46-6.56 7.95c-3.26 1.81-7.15 2.32-10.75 1.27c-1.62-.48-3.82-1.5-4.93-2.8c-1.17-1.36-1.56-4.12-1.68-5.86" /><path fill="#fff" d="m53.56 36.35l-1.45 2.32l3.48.29l1.16-2.61l-1.74-1.74zm-4.77 4.4l-2.73.17l1.78 2.99l2.79-.56l.42-2.43zm9.23 1.82l-2.79-.01l2.03 3.34l2.82-.42l.26-2.57zm-9.76 4.92l1.45-.94l.94.87l-.51.79l-1.09.22zm11.44-7.97l-.43 1.52l1.81.07l.07-1.44zm.94-5.36s-1.3 1.23-1.09 1.3c.22.07 2.03.29 2.03.29l.72-1.16zm-11.01.29s-1.67 1.74-1.23 1.74c.43 0 1.67-.22 1.67-.22l.72-1.16zm-6.73 8.62l-.65 1.16l1.01 1.09s.65-.8.65-1.09s-.29-1.16-.29-1.16z" /><path fill="#ed6c30" d="M75.86 58.63c.25-2.4 1.77-4.86 5.14-7.03c2.43-1.56 4.94-2.12 7.8-1.72c6.54.9 12.61 4.41 10.74 12.13c-.78 3.21-4.89 5.73-7.78 6.75c-3.52 1.26-7.44 1.11-10.81-.52c-1.52-.73-3.52-2.11-4.41-3.57c-.93-1.52-.87-4.3-.68-6.04" /><path fill="#fff" d="m84.65 54.69l.42 2.7l2.82-2.06l-.82-2.73l-2.46-.18zm-.73 6.45l-1.96 1.9l3.31 1.11l1.75-2.26l-1.28-2.1zm8.17-4.66l-2.11 1.82l3.71 1.2l1.86-2.17l-1.48-2.11zm-.25 7.31l1.45-.95l.94.88l-.5.79l-1.09.22zm-7.32 1.83s-1.3 1.23-1.09 1.3c.22.07 2.03.29 2.03.29l.72-1.16zm-4.86-9.1l-.65 1.16l1.01 1.09s.65-.8.65-1.09s-.29-1.16-.29-1.16z" /><path fill="#dda450" d="M54.1 25.35c2.9-1.12 5.4.26 8.27 1.3c2.05.75 4.03 1.68 6 2.6c6.07 2.85 12.14 5.69 18.2 8.54c2.96 1.39 5.93 2.79 8.55 4.75c3.09 2.31 5.77 4.96 8.21 7.95c1.96 2.39 3.92 6.64 3.4 9.7c-.29 1.02-1.09.42-1.26.06a35.44 35.44 0 0 0-10.98-12.9c-5.76-4.13-12.61-6.43-19.4-8.49c-1.69-.52-3.42-1.03-4.91-1.98c-1.67-1.06-2.96-2.6-4.46-3.89c-3.54-3.06-8.28-4.7-12.96-4.48c-.99.09-.45-2.39 1.34-3.16" /><path fill="#dda450" d="M125.83 59.5c-1.74-2.88-4.73-4.36-8.01-3.61c-3.08.71-6.79 4.14-8.24 6.96c-1.45 2.81-2.26 7.71-4.97 9.34c-3.13 1.9-7.22 1.32-10.54 2.86c-2.18 1.02-4.7 2.45-6.78 3.67c-3.04 1.79-5.86 2.51-9.34 3.11s-7.91 1.74-10.04 4.56c-.77 1.03-1.29 2.23-2.09 3.24c-3.12 3.98-6.82 1.57-11.81.73c-1.59-.27-3.61-.44-5.16 0c-1.64.46-4.83 2.84-6.34 3.64c-3.78 2.02-8.08.16-12.01 1.87c-5.19 2.26-7.88 8.07-12.57 11.25c-2.67 1.81-6.05 2.69-9.19 1.96c-2.37-.55-4.54-2.1-5.75-4.19c.25 3.38.96 6.97 2.21 10.9c1.11 3.52 3.65 9.27 8.22 9.05c4.57-.21 5.29-6.02 6.12-9.33c.42-1.7.92-3.72 2.32-4.94c.75-.65 1.38-.44 2.22-.67c.85-.23.92-.4 1.59-.89c1.87-1.37 2.38-.71 3.82.7c2.07 2.03 5.5 1.87 8.12 1.35c1.53-.3 2.03-.63 2.94-1.77c.98-1.24 2.48-2.05 3.35-3.37c.9-1.36.93-1.84 2.59-2.39c3.54-1.17 4.51 1.29 7.04 3.02c2.48 1.7 5.85 2.36 8.78 1.68c1.42-.33 1.83-.72 2.53-1.88c.83-1.39 1.91-2.33 2.91-3.59c1.1-1.4 1.98-2.25 3.49-3.2c1.37-.86 2.6-1.24 4.15-1.73c2.84-.9 5.58-2.15 8.4-3.09c3.67-1.23 7.34-2.46 11.01-3.7c7.22-2.46 14.42-4.97 21.56-7.62c4.08-1.51 8.65-2.71 9.71-7.47c.36-1.61.63-3.24.8-4.88c.12-1.15.19-2.3.21-3.43c.01-2.45.08-5.95-1.25-8.14" /></svg>
            <span className='fw-bold ms-2 ' style={{ color: '#ff4400' }}> <i>PizzaHeaven</i></span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mx-auto gap-4">
              <Nav.Link href="#features" className="nav-link">{language === 'en' ? 'Home' : 'Inicio'}</Nav.Link>
              <Nav.Link href="#features" className="nav-link">{language === 'en' ? 'Pages' : 'Páginas'}</Nav.Link>
              <Nav.Link href="#features" className="nav-link">{language === 'en' ? 'System Pages' : 'Páginas del Sistema'}</Nav.Link>
              <Nav.Link href="#features" className="nav-link">{language === 'en' ? 'Blog' : 'Blog'}</Nav.Link>
              <Nav.Link href="#features" className="nav-link">{language === 'en' ? 'Help' : 'Ayuda'}</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link href="#deets">
                <div className="mt-3 d-lg-flex d-none">
                  <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                      <i className="bi bi-globe-central-south-asia"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={toggleLanguage}>
                        <Button>{language === 'en' ? 'Change to Spanish' : 'Cambiar a Inglés'}</Button>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Nav.Link>
              <Nav.Link eventKey={2} href="#memes">
                <Button variant="light" className=" ms-3 me-3 mt-3 p-2 d-lg-flex d-none fw-bold" style={{ color: '#ff4400' }}>{language === 'en' ? 'Book table' : 'Reservar mesa'}</Button>
              </Nav.Link>
              <Nav.Link>
                <Button variant="light" className='me-3 mt-3 d-lg-flex d-none' onClick={setShow}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-1.11.89-2 2-2M1 2h3.27l.94 2H20a1 1 0 0 1 1 1c0 .17-.05.34-.12.5l-3.58 6.47c-.34.61-1 1.03-1.75 1.03H8.1l-.9 1.63l-.03.12a.25.25 0 0 0 .25.25H19v2H7a2 2 0 0 1-2-2c0-.35.09-.68.24-.96l1.36-2.45L3 4H1zm6 16a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-1.11.89-2 2-2m9-7l2.78-5H6.14l2.36 5z" /></svg>
                  ({cartItems.length})
                </Button>
              </Nav.Link>
              <Nav.Link><Button variant="light" className='ms-2 mt-3 d-lg-flex d-none' onClick={() => setShowModal(true)}><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#000" fillRule="evenodd" d="M11 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3zm1.293 6.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414-1.414L13.586 13H5a1 1 0 1 1 0-2h8.586l-1.293-1.293a1 1 0 0 1 0-1.414" clipRule="evenodd"></path></svg>&nbsp; Login</Button></Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>


      <div className='maindiv' style={{ position: 'relative', overflow: 'hidden' }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="main hover-background"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <Container className='p-5'>
            <Row className="colu1">
              <Col md={7} className="order-md-1 order-2 mt-5  mt-md-0 mt-lg-5 ">
                <div className="text-start text-md-start text-center mt-md-5">
                  <span style={{ color: '#ff4800', letterSpacing: '2px' }} className="fs-5" >
                    {language === 'en' ? 'LIMITED TIME OFFER FOR $29' : 'OFERTA POR TIEMPO LIMITADO POR $29'}
                  </span>
                  <h1 className="heading text-white">
                    {language === 'en' ? 'HOTTEST &' : 'MÁS CALIENTE &'} <br />
                    {language === 'en' ? 'TASTE' : 'SABOR'} <span className="pizz"><SplitText
                      text="PIZZA"
                      className="text-2xl font-semibold text-center"
                      delay={150}
                      animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                      animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                      easing="easeOutCubic"
                      threshold={0.2}
                      rootMargin="-50px"
                      onLetterAnimationComplete={handleAnimationComplete}
                    /></span>
                    <br /> {language === 'en' ? 'IN THIS TOWN' : 'EN ESTA CIUDAD'}
                  </h1>
                  <div className="hero-button">
                    <button className="but mt-3 button">{language === 'en' ? 'Order Now' : 'Ordenar Ahora'}</button>
                  </div>
                </div>
              </Col>
              <Col md={5} className="order-md-2 order-1">
                <div className="hero-image mt-4 mt-lg-5">
                  <img
                    src="https://22271054.fs1.hubspotusercontent-na1.net/hub/22271054/hubfs/hero-img-1.png?width=656&height=647&name=hero-img-1.png"
                    alt="hero-img-1"
                    loading="lazy"
                    width="656"
                    height="647"
                    style={{ maxWidth: '100%', height: 'auto' }}
                    className="img-fluid  image"
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </motion.div>
      </div>


      <div>
        <Container className="py-3">
          <div>
            <h5 className="mt-5  fs-5 text-center core"><SplitText
              text="CORE FEATURES"
              className="text-2xl font-semibold text-center"
              delay={150}
              animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
              animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
              easing="easeOutCubic"
              threshold={0.2}
              rootMargin="-50px"
              onLetterAnimationComplete={handleAnimationComplete}
            /></h5>
            <h2 className="mt-3 fs-2 text-center " style={{ fontWeight: 'initial' }}>WHY CHOOSE US</h2>
          </div>

          <img src="https://themes.templatescoder.com/pizzon/html/demo/1-2/01-Modern/images/leaf.png" alt="" style={{ height: '100px', width: '130px', alignItems: 'start', position: 'absolute', left: '0' }} className='d-none d-lg-block' />

          <Row className="mt-5 gy-4 mx-auto justify-content-center">
            <Col className="d-flex justify-content-center">
              <Card style={{ width: '16rem', backgroundColor: 'rgba(255, 238, 235, 1.0)', border: 'none' }} className='feature-card p-3'>
                <Card.Body >
                  <Card.Title>
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none" className="injected-svg inject-me" style={{ maxWidth: '100%', height: 'auto' }}> <path d="M60.25 33.875H62.125C63.1606 33.875 64 33.0356 64 32C64 14.3799 49.6187 0 32 0C14.3799 0 0 14.3813 0 32C0 32.4971 0.197754 32.9741 0.549316 33.3257C0.900879 33.6777 1.37793 33.875 1.875 33.875H3.75V45.125H1.875C0.839355 45.125 0 45.9644 0 47C0 56.3301 7.67236 64 17 64H47C56.3301 64 64 56.3276 64 47C64 45.9644 63.1606 45.125 62.125 45.125H60.25C60.25 43.7583 60.25 35.2461 60.25 33.875ZM56.5 45.2505C52.7158 45.7583 49.2642 47.7803 47.0049 50.791C44.4043 47.2827 40.2554 45.125 35.75 45.125H20.3159C22.2368 42.771 25.1162 41.375 28.25 41.375H56.5V45.2505ZM7.5 41.5459C9.91895 41.9878 12.1162 43.2676 13.666 45.125H7.5V41.5459ZM32 3.75C46.9468 3.75 59.2197 15.4204 60.1885 30.1265L3.81152 30.125C4.78027 15.4189 17.0532 3.75 32 3.75ZM56.5 33.875V37.625H28.25C25.6465 37.625 23.0991 38.3486 20.8843 39.7173C19.3657 40.6562 18.0483 41.8701 16.9951 43.291C14.7358 40.2803 11.2842 38.2583 7.5 37.7505V33.8735L56.5 33.875ZM47 60.25H17C10.3301 60.25 4.7959 55.2964 3.88232 48.875H35.75C39.6445 48.875 43.1479 51.0293 44.9043 54.502L45.2788 55.3682C45.5752 56.0552 46.252 56.5 47 56.5C47.748 56.5 48.4248 56.0552 48.7212 55.3682L49.0957 54.502C50.8271 51.082 54.4639 48.8735 58.375 48.8735H60.1177C59.2041 55.2949 53.6699 60.25 47 60.25Z" fill="#F43127"></path> <path d="M32 15.125C30.9644 15.125 30.125 15.9644 30.125 17V20.75C30.125 21.7856 30.9644 22.625 32 22.625C33.0356 22.625 33.875 21.7856 33.875 20.75V17C33.875 15.9644 33.0356 15.125 32 15.125Z" fill="#F43127"></path> <path d="M19.4243 11.9243L15.6743 15.6743C14.9419 16.4062 14.9419 17.5933 15.6743 18.3257C16.4062 19.0581 17.5938 19.0581 18.3257 18.3257L22.0757 14.5757C22.8081 13.8433 22.8081 12.6562 22.0757 11.9243C21.3438 11.1919 20.1562 11.1919 19.4243 11.9243Z" fill="#F43127"></path> <path d="M44.5757 11.9243C43.8438 11.1919 42.6562 11.1919 41.9243 11.9243C41.1919 12.6562 41.1919 13.8433 41.9243 14.5757L45.6743 18.3257C46.4062 19.0581 47.5933 19.0581 48.3257 18.3257C49.0581 17.5933 49.0581 16.4062 48.3257 15.6743L44.5757 11.9243Z" fill="#F43127"></path> </svg>
                  </Card.Title>
                  <Card.Subtitle className="my-3 fs-3" style={{ fontWeight: 'normal' }}>
                    {language === 'en' ? (<> Quality of <br /> Food </>) : (<> Comida de  Calidad </>)}
                  </Card.Subtitle>
                  <Card.Text>
                    {language === 'en' ? 'Many desktops publish packages webpages in editors now.' : 'Ahora muchos escritorios publican paquetes de páginas en editores.'}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col className="d-flex justify-content-center">
              <Card style={{ width: '16rem', backgroundColor: '#f6f2ff', border: 'none' }} className='feature-card p-3'>
                <Card.Body>
                  <Card.Title>
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none" className="injected-svg inject-me" style={{ maxWidth: '100%', height: 'auto' }}>  <g clipPath="url(#clip0_57_654-2)">  <path d="M64 41.375C64 36.2056 59.7944 32 54.625 32H52.3389L49.5264 20.75H50.875C51.9106 20.75 52.75 19.9106 52.75 18.875V11.375C52.75 10.3394 51.9106 9.5 50.875 9.5H43.375C40.9307 9.5 38.8467 11.0679 38.0723 13.25H31.875C30.8394 13.25 30 14.0894 30 15.125C30 16.1606 30.8394 17 31.875 17H38.0723C38.6787 18.7095 40.0889 20.04 41.8467 20.5371C41.1797 21.2603 40.5786 22.0469 40.0562 22.8916C38.5474 25.333 37.75 28.1401 37.75 31.0103V39.5H29.4766L26.9766 32H28.125C29.1606 32 30 31.1606 30 30.125C30 25.5977 26.7739 21.8096 22.5 20.9385V18.875C22.5 14.3477 19.2739 10.5596 15 9.68848V7.625C15 6.58936 14.1606 5.75 13.125 5.75C12.0894 5.75 11.25 6.58936 11.25 7.625V9.68848C6.97607 10.5596 3.75 14.3477 3.75 18.875V21.0723C1.56738 21.8467 0 23.9307 0 26.375C0 28.9678 1.76367 31.1553 4.1543 31.8037C1.59912 34.1997 0 37.604 0 41.375V48.875C0 49.9106 0.839355 50.75 1.875 50.75H3.93848C4.80957 55.0239 8.59766 58.25 13.125 58.25C17.6523 58.25 21.4404 55.0239 22.3115 50.75H45.4385C46.3096 55.0239 50.0977 58.25 54.625 58.25C59.7944 58.25 64 54.0444 64 48.875C64 46.7661 63.2998 44.8179 62.1201 43.25H62.125C63.1606 43.25 64 42.4106 64 41.375ZM59.9287 39.5H54.625C52.5698 39.5 50.668 40.1665 49.1211 41.2925C49.4277 39.2383 50.3125 37.3276 51.6914 35.75H54.625C57.0693 35.75 59.1548 37.3174 59.9287 39.5ZM43.375 13.25H49V17H43.375C42.3413 17 41.5 16.1587 41.5 15.125C41.5 14.0913 42.3413 13.25 43.375 13.25ZM26.3462 41.9678C26.6016 42.7334 27.3179 43.25 28.125 43.25H39.625C40.6606 43.25 41.5 42.4106 41.5 41.375V31.0103C41.5 27.3682 43.1533 24.0264 45.9331 21.8384L48.8096 33.3442C46.5068 36.0078 45.25 39.3716 45.25 42.9282V47H26.1157C25.2026 40.6479 19.7256 35.75 13.125 35.75C9.55029 35.75 6.30566 37.187 3.93652 39.5127C4.80273 35.2324 8.59326 32 13.125 32H23.0234L26.3462 41.9678ZM3.93848 47C4.80957 42.7261 8.59766 39.5 13.125 39.5C17.6523 39.5 21.4404 42.7261 22.3115 47H3.93848ZM13.125 13.25C16.2266 13.25 18.75 15.7734 18.75 18.875V20.75H7.5V18.875C7.5 15.7734 10.0234 13.25 13.125 13.25ZM5.625 28.25C4.59131 28.25 3.75 27.4087 3.75 26.375C3.75 25.3413 4.59131 24.5 5.625 24.5H20.625C23.0693 24.5 25.1548 26.0674 25.9287 28.25C23.9697 28.25 7.57666 28.25 5.625 28.25ZM13.125 54.5C10.6807 54.5 8.59668 52.9312 7.82227 50.7485H18.4272C17.6533 52.9312 15.5693 54.5 13.125 54.5ZM60.25 48.875C60.25 51.9766 57.7266 54.5 54.625 54.5C51.5234 54.5 49 51.9766 49 48.875C49 45.7734 51.5234 43.25 54.625 43.25C57.7266 43.25 60.25 45.7734 60.25 48.875Z" fill="#8351FF"></path> <path d="M56.5 48.875C56.5 49.9106 55.6606 50.75 54.625 50.75C53.5894 50.75 52.75 49.9106 52.75 48.875C52.75 47.8394 53.5894 47 54.625 47C55.6606 47 56.5 47.8394 56.5 48.875Z" fill="#8351FF"></path>  </g> </svg>
                  </Card.Title>
                  <Card.Subtitle className="my-3 fs-3" style={{ fontWeight: 'normal' }}>
                    {language === 'en' ? 'On Time Delivery' : 'Entrega a Tiempo'}
                  </Card.Subtitle>
                  <Card.Text>
                    {language === 'en' ? 'Many desktops publish packages webpages in editors now.' : 'Ahora muchos escritorios publican paquetes de páginas en editores.'}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col className="d-flex justify-content-center">
              <Card style={{ width: '16rem', backgroundColor: '#fff2dd', border: 'none' }} className='feature-card p-3'>
                <Card.Body>
                  <Card.Title>
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none" className="injected-svg inject-me" style={{ maxWidth: '100%', height: 'auto' }}>  <g clipPath="url(#clip0_57_666-3)">  <path d="M59.8936 53.2529L51.9591 37.3823C54.5562 33.5518 56.0753 28.9336 56.0753 23.9668C56.0753 10.7515 45.3238 0 32.1085 0C18.8931 0 8.14167 10.7515 8.14167 23.9668C8.14167 28.9336 9.66072 33.5522 12.2584 37.3833L4.32283 53.2529C4.0323 53.8345 4.06355 54.5244 4.40486 55.0771C4.74665 55.6299 5.35017 55.9668 6.00007 55.9668H15.1041L20.5665 63.25C20.9229 63.7246 21.4796 64 22.0665 64C22.8443 64 23.4571 63.5361 23.7437 62.9634L31.2672 47.917C31.5465 47.9268 31.8267 47.9336 32.1085 47.9336C32.3902 47.9336 32.6705 47.9268 32.9498 47.917L40.4732 62.9634C40.7589 63.5352 41.3721 64 42.1505 64C42.7369 64 43.294 63.7246 43.65 63.25L49.1129 55.9668H58.2169C58.8668 55.9668 59.4703 55.6299 59.8116 55.0771C60.1534 54.5244 60.1846 53.8345 59.8936 53.2529ZM21.7467 58.5728L17.5416 52.9668C17.1876 52.4946 16.6319 52.2168 16.0416 52.2168H9.03376L14.8521 40.5811C18.1558 44.0107 22.4683 46.4624 27.3077 47.4502L21.7467 58.5728ZM11.8917 23.9668C11.8917 12.8193 20.961 3.75 32.1085 3.75C43.2559 3.75 52.3253 12.8193 52.3253 23.9668C52.3253 35.1143 43.2559 44.1836 32.1085 44.1836C20.961 44.1836 11.8917 35.1143 11.8917 23.9668ZM48.1749 52.2168C47.585 52.2168 47.0294 52.4946 46.6749 52.9668L42.4703 58.5728L36.9088 47.4502C41.7486 46.4619 46.0616 44.0107 49.3653 40.5801L55.1827 52.2163H48.1749V52.2168Z" fill="#FCB302"></path>  <path d="M41.6795 27.0767L46.9158 20.8267C47.3308 20.3315 47.4617 19.6577 47.262 19.0435C47.0623 18.4287 46.5603 17.9604 45.9339 17.8037L38.0242 15.8252L33.6975 8.91357C33.3548 8.36572 32.7542 8.0332 32.1082 8.0332C31.4622 8.0332 30.8616 8.36572 30.5188 8.91357L26.1932 15.8252L18.284 17.8037C17.657 17.9604 17.1551 18.4287 16.9554 19.043C16.7561 19.6577 16.8865 20.3315 17.3016 20.8267L22.5379 27.0767L21.9744 35.21C21.93 35.8545 22.22 36.4766 22.7425 36.8564C23.5359 37.4331 24.3431 37.1602 24.5457 37.0786L32.1082 34.0308L39.6707 37.0791C40.2698 37.3203 40.951 37.2363 41.4734 36.8569C41.9964 36.477 42.2864 35.855 42.242 35.2104L41.6795 27.0767ZM38.3196 25.2476C38.0081 25.6196 37.8528 26.0972 37.8865 26.5811L38.2942 32.481L32.8094 30.27C32.2015 30.0249 31.6683 30.1645 31.4075 30.27L25.9226 32.481L26.3313 26.5815C26.3645 26.0977 26.2093 25.6196 25.8977 25.2476L22.0999 20.7148L27.8367 19.2798C28.3074 19.1621 28.7137 18.8667 28.971 18.4556L32.1087 13.4424L35.2469 18.4556C35.5042 18.8667 35.9104 19.1621 36.3811 19.2798L42.118 20.7148L38.3196 25.2476Z" fill="#FCB302"></path> </g>  <defs>  <clipPath id="clip0_57_666-3">  <rect width="64" height="64" fill="white"></rect>  </clipPath>  </defs> </svg>
                  </Card.Title>
                  <Card.Subtitle className="my-3 fs-3" style={{ fontWeight: 'normal' }}>
                    {language === 'en' ? 'Hygine Certified' : 'Certificado de Higiene'}
                  </Card.Subtitle>
                  <Card.Text>
                    {language === 'en' ? 'Many desktops publish packages webpages in editors now.' : 'Ahora muchos escritorios publican paquetes de páginas en editores.'}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col className="d-flex justify-content-center">
              <Card style={{ width: '16rem', backgroundColor: '#effbf2', border: 'none' }} className='feature-card p-3'>
                <Card.Body>
                  <Card.Title>
                    <svg xmlns="http://www.w3.org/2000/svg" width="73" height="64" viewBox="0 0 73 64" fill="none" className="injected-svg inject-me" style={{ maxWidth: '100%', height: 'auto' }}>  <g clipPath="url(#clip0_223_1638-4)">  <path d="M72.1019 0.416C71.5567 0 70.819 -0.096 70.1775 0.128C62.7043 2.624 57.3801 8.992 56.1612 16.544C50.7728 11.296 43.6845 8.544 36.5 8.544C31.0795 8.544 25.8515 10.08 21.3932 12.896V2.144C21.3932 0.96 20.431 0 19.2443 0C18.0576 0 17.0953 0.96 17.0953 2.144V10.656C17.0953 11.84 16.1331 12.8 14.9464 12.8H12.7975V2.144C12.7975 0.96 11.8352 0 10.6485 0C9.46177 0 8.49956 0.96 8.49956 2.144V12.8H6.35061C5.16388 12.8 4.20167 11.84 4.20167 10.656V2.144C4.20167 0.96 3.23946 0 2.05272 0C0.865993 0 0 0.96 0 2.144V14.944C0 18.304 1.60369 21.472 4.26582 23.488V57.632C4.26582 61.152 7.15246 64.032 10.6806 64.032C14.2087 64.032 17.0953 61.152 17.0953 57.632V56.288C22.4196 61.344 29.3796 64.032 36.4679 64.032C45.8656 64.032 54.9104 59.264 60.1384 51.04V57.632C60.1384 61.152 63.025 64.032 66.5532 64.032C70.0813 64.032 72.9679 61.152 72.9679 57.632V2.144C72.9679 1.472 72.6472 0.8 72.0699 0.416H72.1019ZM10.6806 59.744C9.49385 59.744 8.53163 58.784 8.53163 57.6V22.336C8.53163 21.568 8.11467 20.864 7.4732 20.48C6.06195 19.648 5.00351 18.336 4.55448 16.8C5.13181 16.992 5.77329 17.088 6.41476 17.088H14.9785C15.6199 17.088 16.2614 16.992 16.8388 16.8C16.3576 18.336 15.3313 19.648 13.92 20.48C13.2465 20.864 12.8616 21.568 12.8616 22.336V57.6C12.8616 58.784 11.8994 59.744 10.7127 59.744H10.6806ZM36.4679 59.744C28.7061 59.744 21.4895 56.032 17.0953 49.76V23.456C18.699 22.24 19.9178 20.608 20.6555 18.784C24.9214 14.976 30.6626 12.8 36.5 12.8C44.2619 12.8 51.4785 16.512 55.8726 22.784V40.544C55.8726 41.728 56.8348 42.688 58.0215 42.688H59.2724C56.4178 52.576 47.0523 59.744 36.5 59.744H36.4679ZM68.67 57.6C68.67 58.784 67.7078 59.744 66.5211  59.744C65.3344 59.744 64.3721 58.784 64.3721 57.6V40.544C64.3721 39.36 63.4099 38.4 62.2232 38.4H60.0742V19.904C60.0742 13.792 63.4099 8.288 68.638 5.408V57.6H68.67Z" fill="#3FD164"></path>  </g> <defs> <clipPath id="clip0_223_1638-4"> <rect width="73" height="64" fill="white"></rect> </clipPath>  </defs>  </svg>
                  </Card.Title>
                  <Card.Subtitle className="my-3 fs-3" style={{ fontWeight: 'normal' }}>
                    {language === 'en' ? 'Order Your Food' : 'Ordena Tu Comida'}
                  </Card.Subtitle>
                  <Card.Text>
                    {language === 'en' ? 'Many desktops publish packages webpages in editors now.' : 'Ahora muchos escritorios publican paquetes de páginas en editores.'}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

        </Container>
      </div>

      <div className="py-5 gradient-background" >
        <h5 className='text-center mt-5 ' style={{ letterSpacing: '2px', color: '#ff4800' }}><SplitText
          text="PRICING MENU"
          className="text-2xl font-semibold text-center"
          delay={150}
          animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
          animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
          easing="easeOutCubic"
          threshold={0.2}
          rootMargin="-50px"
          onLetterAnimationComplete={handleAnimationComplete}
        /></h5>
        <h2 className='text-center mt-3 '>DELECIOUS DEALS FOR YOU</h2>




        <Container className="mt-4">
          <h1 className="text-center">Pizza Menu</h1>
          <div className="text-center my-3 mb-5 button-group">
          <Button variant="danger rounded-5 mb-2 mx-3" onClick={() => handleCategoryClick("all")}>
              All
            </Button>
            <Button variant="danger rounded-5 mb-2" onClick={() => handleCategoryClick("veg")}>
              Veg Pizzas
            </Button>
            <Button variant="danger rounded-5 mx-3 mb-2" onClick={() => handleCategoryClick("nonveg")}>
              Non-Veg Pizzas
            </Button>
            <Button variant="danger rounded-5 mb-2" onClick={() => handleCategoryClick("salad")}>
              Salad
            </Button>
            <Button variant="danger rounded-5 mx-3 mb-2" onClick={() => handleCategoryClick("beverages")}>
              Beverages
            </Button>
          </div>


          <CSSTransition
        in={showModal}
        timeout={300}
        classNames="modal-transition"
        unmountOnExit
      >
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton className="modal-header">
            <Modal.Title>Login/Signup</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            <div className="form-container">
              <input
                type="text"
                placeholder="Username"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                className="form-input"
              />
              <input
                type="password"
                placeholder="Password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="form-input"
              />
              <select
                value={user.action}
                onChange={(e) => setUser({ ...user, action: e.target.value })}
                className="form-select"
              >
                <option value="">Select Action</option>
                <option value="login">Login</option>
                <option value="signup">Sign Up</option>
              </select>
              <Button onClick={handleLogin} className="submit-button">
                Submit
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </CSSTransition>



          <animated.div style={offcanvasAnimation}>
            <Offcanvas show={show} onHide={() => setShow(false)} placement="end" className="custom-offcanvas">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Cart</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                {cartItems.length === 0 ? (
                  <p>Your cart is empty.</p>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="mb-3 cart-item">
                      <div className="d-flex align-items-center">
                        <Image
                          src={item.image}
                          alt={item.dishName}
                          rounded
                          className="cart-item-image"
                        />
                        <div>
                          <p className="mb-0">{item.dishName}</p>
                          <p className="mb-0">Quantity: {item.quantity}</p>
                          <p className="mb-0">Price: ${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="mt-2 d-flex">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => incrementQuantity(item.id)}
                          className="cart-button"
                        >
                          +
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => decrementQuantity(item.id)}
                          className="cart-button mx-2"
                        >
                          -
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-dark"
                          onClick={() => deleteCartItem(item.id)}
                          className="cart-button"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
                <Button variant="success" onClick={handleCheckout} className="checkout-button">
                  Checkout
                </Button>
              </Offcanvas.Body>
            </Offcanvas>
          </animated.div>

         
          <Row className="flex-column">
            {filteredProducts.map((dish, index) => (
              <Col md={12} key={index} className="mb-4 justify-content-center d-flex">
                <Card className="hover-card rounded-5 border-0" id="cd" style={{ width: "28rem" }}>
                  <Card.Body className="d-flex">
                    <div className="d-flex flex-column align-items-center">
                      <img
                        src={dish.image}
                        alt=""
                        style={{ height: "80px", width: "80px", borderRadius: "25%" }}
                      />
                    </div>
                    <div className="d-flex flex-column justify-content-between ms-3" style={{ flex: 1 }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <Card.Title className="mb-0">{dish.name}</Card.Title>
                        <Button
                          className="text-white rounded-5"
                          onClick={() => addToCart(dish.name, dish.price, dish.image)}
                          id="bu"
                        >
                          Add to Cart
                        </Button>
                      </div>
                      <Card.Text className="mt-2">{dish.description}</Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      <section className="py-5 " >

        <h5 className='text-center mt-5 ' style={{ letterSpacing: '2px', color: '#ff4800' }}><SplitText
          text="POPULAR PRODUCTS"
          className="text-2xl font-semibold text-center"
          delay={150}
          animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
          animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
          easing="easeOutCubic"
          threshold={0.2}
          rootMargin="-50px"
          onLetterAnimationComplete={handleAnimationComplete}
        /></h5>
        <h1 className='text-center mt-3 '>CHOOSE YOUR ITEMS</h1>

        <div style={{ padding: "20px", boxSizing: "border-box", overflow: "hidden" }}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Our Food Items</h2>
          <Slider {...settings}>
            {foodItems.map((item) => (
              <div key={item.id} style={{ padding: "10px" }}>
                <div
                  className="card"
                  style={{
                    position: "relative",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    overflow: "hidden",
                    textAlign: "center",
                    transition: "background-color 0.3s ease",
                    margin: "10px",
                    height: "300px"
                  }}
                >
               
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "130px",
                      objectFit: "contain",
                      marginBottom: "20px",
                     
                    }}
                    className='mb-5'
                  />
                  
                  <div
                    className="overlay"

                  >
                    <button
                      className="add-to-cart-btn mt-5"
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#ff6347",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        transition: "transform 0.3s ease, opacity 0.3s ease",
                        marginBottom: "10px"
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                 
                  <h3 style={{ margin: "10px 0" }} className='mt-5'>{item.name}</h3>
                </div>
              </div>
            ))}
          </Slider>
          <style>
            {`
 .card:hover {
 background-color: #f0f0f0;
 }

 .card:hover .overlay {
 opacity: 1;
 visibility: visible;
}

 .add-to-cart-btn {
 transform: scale(0.8);
 opacity: 0;
 }

 .card:hover .add-to-cart-btn {
 transform: scale(1);
 opacity: 1;
 }

 body {
 margin: 0;
 padding: 0;
overflow-x: hidden;
 }
 `}
          </style>
        </div>

      </section>

      <section className="py-5" style={{ backgroundColor: 'rgb(253, 247, 234)' }}>
        <h5 className='text-center mt-5 ' style={{ letterSpacing: '2px', color: '#ff4800' }}><SplitText
          text="OUR CHEFS"
          className="text-2xl font-semibold text-center"
          delay={150}
          animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
          animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
          easing="easeOutCubic"
          threshold={0.2}
          rootMargin="-50px"
          onLetterAnimationComplete={handleAnimationComplete}
        /></h5>
        <h1 className='text-center mt-3 '>PROFESSIONAL LEADERS</h1>
        <Container>
          <Row>
            {chefs.map((chef) => (
              <Col md={4} key={chef.id}>
                <Card className="mb-4 p-3">
                  <Card.Img variant="top" src={chef.image} style={{ height: 'auto' }} />
                  <Card.Body>
                    <Card.Title>{chef.name}</Card.Title>
                    <Card.Text className='fs-5 ' style={{ color: 'GrayText' }}>{chef.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="py-5">

        <h5 className='text-center mt-5 ' style={{ letterSpacing: '2px', color: '#ff4800' }}><SplitText
          text="GALLERY"
          className="text-2xl font-semibold text-center"
          delay={150}
          animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
          animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
          easing="easeOutCubic"
          threshold={0.2}
          rootMargin="-50px"
          onLetterAnimationComplete={handleAnimationComplete}
        /></h5>
        <h1 className='text-center mt-3 '>SOME OF POPULAR SHOTS</h1>

        <div>
          <Container>
            <Row className="g-3">
              <Col md={3} xs={12} className="d-flex justify-content-center">
                <div className="image-container">
                  <img
                    src="https://22271054.fs1.hubspotusercontent-na1.net/hub/22271054/hubfs/gallery-1-Sep-10-2022-05-44-38-46-PM.png?width=270&height=380&name=gallery-1-Sep-10-2022-05-44-38-46-PM.png"
                    alt="gallery-1"
                    loading="lazy"
                    className="responsive-image"
                  />
                  <div className="overlay">
                    <Button
                      variant="light"
                      className="eye-button"
                      onClick={() => handleImageClick('https://22271054.fs1.hubspotusercontent-na1.net/hub/22271054/hubfs/gallery-1-Sep-10-2022-05-44-38-46-PM.png')}
                    >
                      <i className="fa fa-eye"></i>
                    </Button>
                  </div>
                </div>
              </Col>
              <Col md={6} xs={12} className="d-flex justify-content-center">
                <div className="image-container">
                  <img
                    src="https://22271054.fs1.hubspotusercontent-na1.net/hub/22271054/hubfs/gallery-2-Sep-10-2022-05-45-16-29-PM.png?width=570&height=380&name=gallery-2-Sep-10-2022-05-45-16-29-PM.png"
                    alt="gallery-2"
                    loading="lazy"
                    className="responsive-image"
                  />
                  <div className="overlay">
                    <Button
                      variant="light"
                      className="eye-button"
                      onClick={() => handleImageClick('https://22271054.fs1.hubspotusercontent-na1.net/hub/22271054/hubfs/gallery-2-Sep-10-2022-05-45-16-29-PM.png')}
                    >
                      <i className="fa fa-eye"></i>
                    </Button>
                  </div>
                </div>
              </Col>
              <Col md={3} xs={12} className="d-flex justify-content-center">
                <div className="image-container">
                  <img
                    src="https://22271054.fs1.hubspotusercontent-na1.net/hub/22271054/hubfs/gallery-3-Sep-10-2022-05-45-50-54-PM.png?width=270&height=380&name=gallery-3-Sep-10-2022-05-45-50-54-PM.png"
                    alt="gallery-3"
                    loading="lazy"
                    className="responsive-image"
                  />
                  <div className="overlay">
                    <Button
                      variant="light"
                      className="eye-button"
                      onClick={() => handleImageClick('https://22271054.fs1.hubspotusercontent-na1.net/hub/22271054/hubfs/gallery-3-Sep-10-2022-05-45-50-54-PM.png')}
                    >
                      <i className="fa fa-eye"></i>
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
          <Container>
            <Row className="g-3">
              <Col md={3} xs={12} className="d-flex justify-content-center">
                <div className="image-container">
                  <img
                    src="https://22271054.fs1.hubspotusercontent-na1.net/hub/22271054/hubfs/gallery-4-Sep-10-2022-05-47-37-52-PM.png?width=270&height=380&name=gallery-4-Sep-10-2022-05-47-37-52-PM.png"
                    alt="gallery-4"
                    loading="lazy"
                    className="responsive-image"
                  />
                  <div className="overlay">
                    <Button
                      variant="light"
                      className="eye-button"
                      onClick={() => handleImageClick('https://22271054.fs1.hubspotusercontent-na1.net/hub/22271054/hubfs/gallery-4-Sep-10-2022-05-47-37-52-PM.png')}
                    >
                      <i className="fa fa-eye"></i>
                    </Button>
                  </div>
                </div>
              </Col>
              <Col md={3} xs={12} className="d-flex justify-content-center ">
                <div className="image-container">
                  <img
                    src="https://22271054.fs1.hubspotusercontent-na1.net/hub/22271054/hubfs/gallery-5-Sep-10-2022-05-48-14-50-PM.png?width=270&height=380&name=gallery-5-Sep-10-2022-05-48-14-50-PM.png"
                    alt="gallery-5"
                    loading="lazy"
                    className="responsive-image"
                  />
                  <div className="overlay">
                    <Button
                      variant="light"
                      className="eye-button"
                      onClick={() => handleImageClick('https://22271054.fs1.hubspotusercontent-na1.net/hub/22271054/hubfs/gallery-5-Sep-10-2022-05-48-14-50-PM.png')}
                    >
                      <i className="fa fa-eye"></i>
                    </Button>
                  </div>
                </div>
              </Col>
              <Col md={6} xs={12} className="d-flex justify-content-center ps-auto">
                <div className="image-container">
                  <img
                    src="https://22271054.fs1.hubspotusercontent-na1.net/hub/22271054/hubfs/gallery-6-Sep-10-2022-05-48-48-65-PM.png?width=570&height=380&name=gallery-6-Sep-10-2022-05-48-48-65-PM.png"
                    alt="gallery-6"
                    loading="lazy"
                    className="responsive-image"
                  />
                  <div className="overlay">
                    <Button
                      variant="light"
                      className="eye-button"
                      onClick={() => handleImageClick('https://22271054.fs1.hubspotusercontent-na1.net/hub/22271054/hubfs/gallery-6-Sep-10-2022-05-48-48-65-PM.png')}
                    >
                      <i className="fa fa-eye"></i>
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>


      <section>
        <h5 className='text-center mt-5 ' style={{ letterSpacing: '2px', color: '#ff4800' }}><SplitText
          text="TESTIMONIALS"
          className="text-2xl font-semibold text-center"
          delay={150}
          animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
          animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
          easing="easeOutCubic"
          threshold={0.2}
          rootMargin="-50px"
          onLetterAnimationComplete={handleAnimationComplete}
        /></h5>
        <h1 className='text-center mt-3 '>WHAT OUR CUSTOMERS SAY</h1>


        <Container className="my-5">
          <div className="section-heading text-center mb-4">
            <h5 className="sub-title">Customer Feedback</h5>
            <h2>Client Testimonials</h2>
          </div>
          <Slider {...settings}>
            {testimonialsData.map((testimonial) => (
              <div key={testimonial.id} style={{ padding: "10px" }}>
                <Card className="shadow-sm border-0 mx-3" style={{ height: "300px" }}>
                  <Card.Img
                    variant="top"
                    src={testimonial.imgSrc}
                    alt={testimonial.altText}
                    className="img-fluid mt-3 rounded-circle ms-2"
                    style={{
                      height: '80px',
                      width: '80px',
                      marginBottom: '20px',
                    }}
                  />
                  <Card.Body>
                    <Card.Title className="fw-bold">{testimonial.name}</Card.Title>
                    <Card.Text>{testimonial.desc}</Card.Text>
                    <div className="testimonial-rating">
                      <ul className="list-inline">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <li key={i} className="list-inline-item">
                            <i className="bi bi-star-fill text-warning" aria-hidden="true"></i>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </Slider>
          <style>
            {`
          .slick-prev, .slick-next {
            z-index: 1;
            top: 50%;
            transform: translateY(-50%);
          }

          .slick-prev {
            left: -25px;
          }

          .slick-next {
            right: -25px;
          }

          @media (max-width: 768px) {
            .slick-prev, .slick-next {
              left: -15px;
              right: -15px;
            }
          }

            @media (max-width: 480px) {
            .slick-prev, .slick-next {
              left: -10px;
              right: -10px;
            }
          }
        `}
          </style>
        </Container>
      </section>
      <section>


      </section>
    </>
  );
}

export default CollapsibleExample;