import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function Mobile({ children }: Props) {
  return (
    <div className="flex h-screen flex-col justify-end rounded-lg border-2 border-b-8 border-gray-100 md:h-[75vh]">
      {children}
    </div>
  );
}

export default Mobile;
