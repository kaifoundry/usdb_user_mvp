
import type { ReactNode } from "react";
import blockBG from "../assets/blockBG.png";
import shadowleft from "../assets/bg_grad-left.png";
import shadowright from "../assets/rightshadow.png";
import Header from "../Layout/Header2";

type MainContainerProps = {
  children: ReactNode; 
};

const MainContainer = ({ children }: MainContainerProps) => {
  return (
    <>
      <div className="min-h-screen w-full relative overflow-hidden">
        {/* Background Images */}
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${blockBG})`,
          }}
        ></div>
        <img
          src={shadowleft}
          alt="Orb Left"
          className="absolute top-1/2 -left-1/2 -translate-y-1/2 pointer-events-none"
        />
        <img
          src={shadowright}
          alt="Orb Right"
          className="absolute -top-8/12 -right-5/12 pointer-events-none"
        />
         <Header/>
        {/* Main Content (Children will be inserted here) */}
        <div className="relative z-10">{children}</div>
      </div>
    </>
  );
};

export default MainContainer;
