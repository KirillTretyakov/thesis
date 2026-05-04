import React from "react";

export const Row = ({
  style,
  ...p
}: {
  style?: React.CSSProperties;
  [key: string]: any;
}) => (
  <div style={{ display: "flex", flexDirection: "row", ...style }} {...p}>
    {p.children}
  </div>
);
