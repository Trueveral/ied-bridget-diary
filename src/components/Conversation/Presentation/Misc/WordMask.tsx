import { a, useSpring } from "@react-spring/web";

export const WordMask = ({
  style,
  className,
  children,
}: {
  style?: any;
  className?: string;
  children?: any;
}) => {
  // const [isHovered, setHovered] = useState(false);

  const hoverStyle = useSpring({
    // opacity: isHovered ? 0 : 1,
    // 合并传入的样式
    from: {
      opacity: 0,
      x: 20,
    },
    to: {
      opacity: 1,
      x: 0,
    },
    delay: Math.random() * 500,
  });

  return (
    <a.div
      style={hoverStyle}
      // onMouseEnter={() => setHovered(true)}
      // onMouseLeave={() => setHovered(false)}
      // className={`${!isHovered ? s.fadeText : ""}`}
    >
      {children ?? children}
    </a.div>
  );
};
