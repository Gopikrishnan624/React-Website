import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dish = () => {
  const [dish, setDish] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category:''
  });

  const [products, setProducts] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDish({
      ...dish,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/dishes', dish);
      alert('Dish added successfully!');
      setDish({ name: '', description: '', price: '', image: '', category:'' });
      fetchProducts(); // Refresh the product list after adding a new dish
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/dishes');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/dishes/${id}`);
      alert('Dish deleted successfully!');
      fetchProducts(); // Refresh the product list after deleting a dish
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Admin Product Page</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Product Name:
          <input type="text" name="name" value={dish.name} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Product Image:
          <input type="text" name="image" value={dish.image} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Product Price:
          <input type="number" name="price" value={dish.price} onChange={handleChange} required />
        </label>
        <br />
        <label>
          description:
          <input type="text" name="description" value={dish.description} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Category:
          <select name="category" value={dish.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="veg">Veg</option>
            <option value="nonveg">Non-Veg</option>
            <option value="salad">Salad</option>
            <option value="beverages">Beverages</option>
          </select>
        </label>
        <br />
        <button type="submit">Add Dish</button>
        <button>delete</button>
      </form>
      <h3>Product List</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              width: '200px',
              textAlign: 'center',
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <h4>{product.name}</h4>
            <p>Price: ${product.price}</p>
            <p>Category: {product.category}</p>
            <p>description:{product.description}</p>
            <button onClick={() => handleDelete(product.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dish;