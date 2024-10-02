'use client';

import { useEffect, useRef, useState } from 'react';

import Button from '@components/Button';

import styles from './page.module.css';

const Home = () => {
  const [products, setProducts] = useState<
    { id: string; properties: { id: string }[] }[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/product', {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => setProducts(data.items));
  }, []);

  const handleClick = () => {
    if (inputRef.current === null || inputRef.current.value === '') {
      return alert('name을 입력해주세요.');
    }

    fetch('/api/product', {
      method: 'POST',
      body: JSON.stringify({ name: inputRef.current.value }),
    })
      .then(res => res.json())
      .then(data => alert(data.message));
  };

  return (
    <div className={styles.page}>
      <input type="text" ref={inputRef} placeholder="name" />
      <button onClick={handleClick}>Add Jacket</button>

      <div>
        <p>Product List</p>
        {products &&
          products.map(item => (
            <div key={item.id}>
              {JSON.stringify(item)}
              {item.properties &&
                Object.entries(item.properties).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => {
                      fetch(`/api/product/${item.id}?propertyId=${value.id}`, {
                        method: 'GET',
                      })
                        .then(res => res.json())
                        .then(data => {
                          console.log(data);
                          alert(JSON.stringify(data.detail));
                        });
                    }}
                  >
                    {key}
                  </button>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
