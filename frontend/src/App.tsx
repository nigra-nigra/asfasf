import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('default');


  const API_URL = '/api/products';

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Ошибка при получении товаров:', error);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, []);

 
  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении товара:', error);
    }
  };


  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'asc') return a.price - b.price;
    if (sortBy === 'desc') return b.price - a.price;
    return 0;
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Каталог компьютерной техники</h1>


      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="default">Без сортировки</option>
          <option value="asc">Цена: по возрастанию</option>
          <option value="desc">Цена: по убыванию</option>
        </select>
      </div>

   
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {sortedProducts.length === 0 ? (
          <p>Товары не найдены или база данных пуста</p>
        ) : (
          sortedProducts.map((product) => (
            <div 
              key={product.id} 
              style={{ border: '1px solid black', padding: '15px', width: '200px' }}
            >
              <img 
                src={product.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk_KF7L1CX7qWxCHyb1_zjpumwm3uc0mcG30mJyuUilQ&s'} 
                alt={product.name} 
                style={{ width: '100%', height: '150px', objectFit: 'cover' }} 
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><b>Цена:</b> {product.price} руб.</p>
              <button onClick={() => handleDelete(product.id)}>Удалить</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;