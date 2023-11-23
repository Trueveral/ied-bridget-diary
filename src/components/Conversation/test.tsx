import React, { useState } from "react";
import { useTransition, animated } from "@react-spring/web";

function AnimatedList() {
  const [items, setItems] = useState([]);

  // 添加新元素的函数
  const addItem = () => {
    setItems(prevItems => [...prevItems, `Item ${prevItems.length}`]);
  };

  const transitions = useTransition(items, {
    from: { opacity: 0, transform: "translateY(-40px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateY(-40px)" },
    keys: item => item,
  });

  return (
    <div>
      <button onClick={addItem}>Add Item</button>
      <div>
        {transitions((style, item) => (
          <animated.div style={style}>{item}</animated.div>
        ))}
      </div>
    </div>
  );
}

export default AnimatedList;
