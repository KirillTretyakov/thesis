import React from "react";

export const Column = ({
  style,
  ...p
}: {
  style?: React.CSSProperties;
  [key: string]: any;
}) => (
  <div style={{ display: "flex", flexDirection: "column", ...style }} {...p}>
    {p.children}
  </div>
);
