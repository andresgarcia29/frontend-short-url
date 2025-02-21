import { animated, SpringValue } from "@react-spring/web";

interface AnimatedDivProps {
  style: { [key: string]: SpringValue<any> };
  children: React.ReactNode;
  className?: string;
}

export default animated.div as React.ComponentType<AnimatedDivProps>;
