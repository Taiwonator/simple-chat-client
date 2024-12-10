import { ReactNode } from "react";
import cx from "classnames";

interface Props {
  children: ReactNode;
  isBlurred: boolean;
}

function Mobile({ children, isBlurred = true }: Props) {
  return (
    <div
      className={cx(
        "flex h-[-webkit-fill-available] w-screen flex-col justify-end rounded-lg border-2 border-b-8 border-gray-100 md:h-[75vh] md:max-w-[356px] md:my-auto",
        isBlurred && "blur-sm",
      )}
    >
      {children}
    </div>
  );
}

export default Mobile;
